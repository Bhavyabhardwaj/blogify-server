import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const tag = await prisma.tag.create({
            data: {
                name: req.body.name,
            }
        })
        res.status(200).json({
            tag,
            message: 'Tag created successfully'
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}