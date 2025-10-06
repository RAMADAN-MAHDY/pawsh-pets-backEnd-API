import { Schema, model, models, Document, Types } from "mongoose";
import { IProduct } from "./Product.js";
import { TUser } from "./user.js";

export interface IFavorite extends Document {
  user: Types.ObjectId | TUser;
  product: Types.ObjectId | IProduct;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const Favorite = models.Favorite || model<IFavorite>("Favorite", favoriteSchema);

export default Favorite;
