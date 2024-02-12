import 'dotenv/config'
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import { userRouter } from "../routes/user";
import { productRouter } from "../routes/products";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user',userRouter);
app.use("/product", productRouter);

console.log(process.env.MONGO_DB_STRING);

try {
    mongoose.connect(process.env.MONGO_DB_STRING);
  } catch (error) {
    console.log(error);
  }

app.listen(process.env.PORT, () => console.log("SERVER STARTED"));
