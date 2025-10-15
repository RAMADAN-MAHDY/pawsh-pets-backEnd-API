import { Router } from "express";
import { registerUser , loginUser , verifyAccessToken , refreshAccessToken ,logoutUser , googleAuth , verifyadminAccessToken , logiadmin , AdminRefreshAccessToken}  from "../controller/authController.js";
import {authMiddleware } from "../middlewares/authMiddleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";

const router = Router();

// POST /api/auth/register 
router.post("/register", registerUser);
// POST /api/auth/logout
router.post("/logout", logoutUser);
//POST /api/auth/google
router.post("/google", googleAuth);


// ----------------------------------------- admin----------------------------------
// POST /api/auth/login   
router.post("/logiadmin", logiadmin);
// POST /api/auth/verify-token
router.post("/verifyadmin-token", authMiddleware, adminAuthMiddleware,verifyadminAccessToken);  
// post /api/auth/refresh-admin-token
router.post("/refresh-admin-token", AdminRefreshAccessToken);





// ------------------------------------------ user------------------------------------------
// POST /api/auth/login
router.post("/login", loginUser);
// POST /api/auth/verify-token
router.post("/verify-token", authMiddleware, verifyAccessToken);
// POST /api/auth/refresh-token
router.post("/refresh-token", refreshAccessToken);
export default router;
