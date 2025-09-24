import { Schema, model, Document, Types } from "mongoose";

export interface IAnimal extends Document {
  user : Types.ObjectId; // Reference to the user who created the animal
  photo: string; // URL or base64
  type: string; // e.g., "dog", "cat"
  name: string;
  breedOrSpecies: string;
  age: number; // years or months
  weight: number; // kg
  gender: "male" | "female" | "unknown";
  identifyingFeatures?: string; // scars, color pattern, etc.
  healthConsiderations?: string; // allergies, conditions
  dietaryNeeds?: string; // special diet
  behaviorAndTemperament?: string; // friendly, aggressive, shy...
  activityLevel?: "low" | "moderate" | "high";
}

const AnimalSchema = new Schema<IAnimal>(
  {
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
  },
  { timestamps: true }
);

export const Animal = model<IAnimal>("Animal", AnimalSchema);
