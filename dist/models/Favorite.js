import { Schema, model, models } from "mongoose";
const favoriteSchema = new Schema({
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
}, { timestamps: true });
const Favorite = models.Favorite || model("Favorite", favoriteSchema);
export default Favorite;
