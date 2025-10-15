import { Schema, model } from "mongoose";
const productSchema = new Schema({
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
}, { timestamps: true });
const Product = model("Product", productSchema);
export default Product;
