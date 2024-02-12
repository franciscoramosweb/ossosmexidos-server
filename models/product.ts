import {Schema, model} from 'mongoose';


export interface IProduct {
    productName:String;
    price: number;
    description: String;
    imageURL: String;
    stockQuantity: number;
}

const ProductSchema = new Schema<IProduct>({
    productName:{type:String, required:true},
    price: {type:Number, required: true, min :[1,"Price of product should be above 1"]},
    description: {type:String, required:true},
    imageURL: {type: String, required: true, min: [0,""]},
    stockQuantity:{type: Number, required:true, min:[0,"Stock can't be lower than 1"]},
});

export const ProductModel = model<IProduct>("product", ProductSchema);