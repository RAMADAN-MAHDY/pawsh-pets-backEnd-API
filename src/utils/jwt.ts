import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET as string; 
const refreshKey = process.env.REFRESH_TOKEN_SECRET as string;


export const generateToken = (payload: any): string =>
   jwt.sign(payload, secretKey ,{expiresIn :"15m"});




export const generateRefreshToken = (payload : any) =>
    jwt.sign(payload, refreshKey, { expiresIn: '7d' });




export const verifyToken = (token: string): any => {

  try {
    // console.log("Verifying Token:", token , secretKey);  
   const decoded =  jwt.verify(token, secretKey);
   return { valid: true, expired: false, decoded };
  } catch (error : any) {
 return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
}


export const verifyRefreshToken = (token: string): any => {

  try {
   const decoded =  jwt.verify(token, refreshKey);
   return { valid: true, expired: false, decoded };
  } catch (error : any) {
 return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
}