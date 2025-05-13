import { Request, Response } from "express";
import prisma from "../db/Client";

const getComments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const comments = await prisma.comment.findMany({
            where: {
                postId: Number(req.params.id),
            },
            select: {
                id: true,
                content: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            },
        })
        res.status(200).json(comments);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error while fetching comments" });
    }

}

const createComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const comment = await prisma.comment.create({
            data: {
                content: req.body.content,
                author: {
                    connect: { id: Number(userId) },
                },
                post: {
                    connect: { id: Number(req.params.id) },
                },
            }
        })
        res.status(200).json({ comment, message: 'Comment created successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error while creating comment" });
    }
}


export { getComments, createComment };