import { Router } from "express";
import { registerUser , loginUser , verifyAccessToken , refreshAccessToken ,logoutUser , googleAuth}  from "../controller/authController.js";

const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);
// POST /api/auth/login
router.post("/login", loginUser);
// POST /api/auth/verify-token
router.post("/verify-token", verifyAccessToken);
// POST /api/auth/refresh-token
router.post("/refresh-token", refreshAccessToken);
// POST /api/auth/logout
router.post("/logout", logoutUser);
//POST /api/auth/google
router.post("/google", googleAuth);
export default router;
