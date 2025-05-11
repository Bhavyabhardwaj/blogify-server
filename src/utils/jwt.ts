import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload: any) => {
    return jwt.sign(payload, "secret");
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, "secret");
}