import { Schema, model, models } from "mongoose";
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
const Category = models.Category || model("Category", categorySchema);
export default Category;
