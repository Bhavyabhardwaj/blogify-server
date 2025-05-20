import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";

const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Authorization header missing or invalid" });
            return;
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const user = await verifyToken(token);
        
        if (!user) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
}

export default authenticateJWT;