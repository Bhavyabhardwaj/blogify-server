import { Request, Response } from "express";
import prisma from "../db/Client";

const getUser = async (req: Request, res: Response) => {
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
};

export { getUser };