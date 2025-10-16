// routes/animalRoutes.ts
import { Router } from "express";
import { createAnimal , updateAnimal , getAnimalsByUserId } from "../controller/animalController.js";
import upload from "../middlewares/upload.js"; 
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/animals", authMiddleware , upload.single("photo") ,createAnimal);
router.patch("/animals/:id", authMiddleware, upload.single("photo"), updateAnimal);
router.get("/animals", authMiddleware, getAnimalsByUserId);

export default router;
