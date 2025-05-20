import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const comments = await prisma.comment.findMany({
            where: {
                postId: Number(req.params.id),
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(comments);
    }
    catch (err) {
        next(err);
    }
};

const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { content } = req.body;
        if (!content) {
            res.status(400).json({ message: "Comment content is required" });
            return;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                author: {
                    connect: { id: Number(userId) },
                },
                post: {
                    connect: { id: Number(req.params.id) },
                },
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });

        res.status(201).json({
            comment,
            message: 'Comment created successfully'
        });
    }
    catch (err) {
        next(err);
    }
};

export { getComments, createComment };