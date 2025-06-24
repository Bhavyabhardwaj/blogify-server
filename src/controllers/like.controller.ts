import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const likePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = Number((req as any).user);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const postId = Number(req.params.id);

        // Check if like already exists
        const existingLike = await prisma.like.findFirst({
            where: { authorId: userId, postId }
        });
        if (existingLike) {
            res.status(200).json({ message: "Already liked" });
            return;
        }

        const like = await prisma.like.create({
            data: {
                author: { connect: { id: userId } },
                post: { connect: { id: postId } },
            }
        });
        res.status(200).json({ like, message: 'Liked successfully' });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const like = await prisma.like.findFirst({
            where: {
                authorId: Number(userId),
                postId: Number(req.params.id),
            }
        });

        if (!like) {
            res.status(404).json({ message: "Post not found" });
        }
        const unlike = await prisma.like.delete({ where: { id: like!.id } });
        res.status(200).json({ unlike, message: 'Unliked successfully' });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const getLikes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const likes = await prisma.like.findMany({
            where: {
                authorId: Number(userId),
            },
            select: {
                id: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                    }
                }
            },
        })
        res.status(200).json(likes);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export { likePost, unlikePost, getLikes };