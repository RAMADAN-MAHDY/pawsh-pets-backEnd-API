import { Animal } from "../models/profile.js"; // مسار الموديل حسب مشروعك
import uploadToImgBB from '../utils/uploadToImgBB.js';
// Create new animal
export const createAnimal = async (req, res) => {
    try {
        // تحقق من وجود المستخدم
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // لو مفيش ملف
        if (!req.file) {
            return res.status(400).json({ message: "Photo is required" });
        }
        const uploadResult = await uploadToImgBB(req.file.buffer);
        ;
        // console.log("user id from token:", req.user.userId);
        const { type, name, breedOrSpecies, age, weight, gender, identifyingFeatures, healthConsiderations, dietaryNeeds, behaviorAndTemperament, activityLevel, } = req.body;
        // تحقق أساسي من القيم المطلوبة
        if (!type || !name || !breedOrSpecies || !age || !weight || !gender) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const animal = new Animal({
            user: req.user.userId,
            photo: uploadResult.url,
            type,
            name,
            breedOrSpecies,
            age,
            weight,
            gender,
            identifyingFeatures,
            healthConsiderations,
            dietaryNeeds,
            behaviorAndTemperament,
            activityLevel,
        });
        await animal.save();
        return res.status(201).json({
            message: "Animal created successfully",
            data: animal,
        });
    }
    catch (error) {
        console.error("Error creating animal:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
