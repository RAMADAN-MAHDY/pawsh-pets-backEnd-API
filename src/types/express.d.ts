import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    [key: string]: any; // لو محتاج تزود بيانات تانية
  };
}
