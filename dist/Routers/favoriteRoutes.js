import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controller/favoriteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/favorites", authMiddleware, addFavorite);
router.get("/favorites", authMiddleware, getFavorites);
router.delete("/favorites/:productId", authMiddleware, removeFavorite);
export default router;
