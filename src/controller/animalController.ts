// controllers/animalController.ts
import { Request, Response } from "express";
import { Animal } from "../models/profile.js"; // مسار الموديل حسب مشروعك
import uploadToImgBB from '../utils/uploadToImgBB.js'
import { AuthRequest } from "../types/express.js";
// Create new animal
export const createAnimal = async (req: AuthRequest, res: Response) => {
    try {
        // تحقق من وجود المستخدم
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // لو مفيش ملف
        if (!req.file) {
            return res.status(400).json({ message: "Photo is required" });
        }

        const uploadResult = await uploadToImgBB(req.file.buffer);;


        // console.log("user id from token:", req.user.userId);

        const {
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
        } = req.body;

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
    } catch (error) {
        console.error("Error creating animal:", error);
        return res.status(500).json({ message: "Server error" });
    }
};



// handel update profaile animale
export const updateAnimal = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        // تحقق من أن المستخدم هو صاحب البروفايل
        if (animal.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        //  الصورة إذا تم رفعها
        if (req.file) {
            const uploadResult = await uploadToImgBB(req.file.buffer);
            animal.photo = uploadResult.url;
        }

        // تحديث الحقول المرسلة فقط
        // for (const key in req.body) {
        //     if (req.body.hasOwnProperty(key)) {
        //         (animal as any)[key] = req.body[key];
        //     }
        // }

        // تحديث الحقول المرسلة فقط
        Object.assign(animal, req.body);

        await animal.save();

        return res.status(200).json({
            message: "Animal updated successfully",
            data: animal,
        });
    } catch (error) {
        console.error("Error updating animal:", error);
        return res.status(500).json({ message: "Server error" });
    }
    
}


// get animals by user id
export const getAnimalsByUserId = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const animals = await Animal.find({ user: req.user.userId });

        return res.status(200).json({
            message: "Animals retrieved successfully",
            data: animals,  
        })
    }catch(error) {
        console.error("Error retrieving animals:", error);
        return res.status(500).json({ message: "Server error" });
    }
}