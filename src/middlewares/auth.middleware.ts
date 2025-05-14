import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";


const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: "Authorization header missing or invalid" });
    }
    const token = authHeader?.split(' ')[1];
    try {
        const user = await verifyToken(token || '');
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
        }
        (req as any).user = user;
        next();
    } catch (error) {
        next(error)
        console.log(error);
    }
}

export default authenticateJWT;