import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "./Category.js";

export interface IProduct extends Document {
  title: string;
  description?: string;
  image: string;
  weight: string;
  price: number;
  rating: number;
  isFavorite: boolean;
  category: Types.ObjectId | ICategory;
  createdAt: Date; 
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL أو Base64
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
