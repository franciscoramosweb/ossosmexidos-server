import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { verifyToken } from "./user";
import { UserModel } from "../models/user";
import { ProductErrors, UserErrors } from "../src/errors";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {

    const products = await ProductModel.find({});

    res.json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/:productId", async (req: Request, res: Response) => {

  const {productId} = req.params;

  try {

    const product = await ProductModel.find({ _id: productId });

    console.log(product[0])

    res.json({ product });

  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/checkout" , async (req: Request, res: Response) => {
  console.log("hello")
  const { customerID, cartItems } = req.body;

  try {
    const user = await UserModel.findById(customerID);
    const productIDs = Object.keys(cartItems);
    const products = await ProductModel.find({ _id: { $in: productIDs } });

    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    if (products.length != productIDs.length) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }

    let totalPrice = 0;

    for (const item in cartItems) {

      const product = products.find((product) => String(product._id) === item);

      if (!product) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }

      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }

      totalPrice += product.price * cartItems[item];
    }

    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
    }

    user.availableMoney -= totalPrice;

    user.purchasedItems.push(...productIDs);

    await user.save();

    await ProductModel.updateMany(
      { _id: { $in: productIDs } },
      { $inc: { stockQuantity: -1 } }
    );

    res.json({purchasedItems: user.purchasedItems})
  } catch (error) {
    res.status(400).json({ error });
  }
});


router.get("/purchased-items/:customerID", verifyToken,async (req:Request, res:Response) => {



  const {customerID} = req.params;

  try {

      const user = await UserModel.findById(customerID);

      if(!user){
        console.log("no user");

          res.status(400).json({type: UserErrors.NO_USER_FOUND});
      }

      console.log("after user");


      const products = await ProductModel.find({_id:{$in: user.purchasedItems}});


      console.log(products)

      res.json({purchasedItems: products});
      
  } catch (error) {
      res.status(500).json({error});
  }
  
});

export { router as productRouter };
