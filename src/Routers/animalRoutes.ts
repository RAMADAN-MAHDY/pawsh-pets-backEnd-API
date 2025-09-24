// routes/animalRoutes.ts
import { Router } from "express";
import { createAnimal } from "../controller/animalController.js";
import upload from "../middlewares/upload.js"; 
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/animals", authMiddleware , upload.single("photo") ,createAnimal);

export default router;
