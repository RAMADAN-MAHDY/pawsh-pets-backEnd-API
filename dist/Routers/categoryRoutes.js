import { Router } from "express";
import { getCategories } from "../controller/categoryController.js";
const router = Router();
// router.post("/categories", authMiddleware, adminAuthMiddleware, createCategory);
router.get("/categories", getCategories);
// router.get("/categories/:id", getCategoryById);
// router.put("/categories/:id", authMiddleware, adminAuthMiddleware, updateCategory);
// router.delete("/categories/:id", authMiddleware, adminAuthMiddleware, deleteCategory);
export default router;
