import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controller/productController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/products", authMiddleware, adminAuthMiddleware, upload.single("image"), createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", authMiddleware, adminAuthMiddleware, upload.single("image"), updateProduct);
router.delete("/products/:id", authMiddleware, adminAuthMiddleware, deleteProduct);

export default router;