import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET;
export const authMiddleware = (req, res, next) => {
    try {
        // ناخد التوكن من الكوكيز
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        // نتحقق من التوكن
        const decoded = jwt.verify(token, secretKey);
        // نخزن بيانات المستخدم في req.user
        req.user = decoded;
        next(); // نكمل للـ controller
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
