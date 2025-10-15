import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";

export const adminAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
}; 