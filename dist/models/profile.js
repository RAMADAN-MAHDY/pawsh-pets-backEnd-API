import { Schema, model } from "mongoose";
const AnimalSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the animal
    photo: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    breedOrSpecies: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "unknown"], required: true },
    identifyingFeatures: { type: String },
    healthConsiderations: { type: String },
    dietaryNeeds: { type: String },
    behaviorAndTemperament: { type: String },
    activityLevel: { type: String, enum: ["low", "moderate", "high"] },
}, { timestamps: true });
export const Animal = model("Animal", AnimalSchema);
