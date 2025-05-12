import { verifyToken } from "../utils/jwt";
import { Request, Response } from "express";


const authenticateJWT = async (req: Request, res: Response, next: any) => {
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
        res.status(401).json({ message: "Token verfiy failed" });
        console.log(error);
    }
}

export default authenticateJWT;