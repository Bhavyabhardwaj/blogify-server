import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
            select: {
                id: true,
                email: true,
                username: true,
                bio: true,
            }
        });
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err)
        next(err);
    }
};

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const { username, bio, avatarUrl} = req.body;
        const user = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                username,
                bio,
                avatarUrl,
            }
        });
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err)
        next(err);
    }
};

export { getUser, updateUserProfile };