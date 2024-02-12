import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import { userRouter } from "../routes/user";
import { productRouter } from "../routes/products";
require("dotenv").config();


const app = express();

app.use(express.json());
app.use(cors());

app.use('/user',userRouter);
app.use("/product", productRouter);

console.log("hello")
try {
    mongoose.connect('mongodb+srv://franciscogramosweb:Sf.Rg.1023@storemern.aut22gd.mongodb.net/storeMERN');
  } catch (error) {
    console.log(error);
  }

app.listen(process.env.PORT || 3001, () => console.log("SERVER STARTED"));
