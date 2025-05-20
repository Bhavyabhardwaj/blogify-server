import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const bookmarkPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { postId } = req.body;
        if (!postId) {
            res.status(400).json({ message: "Post ID is required" });
            return;
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: Number(userId),
                postId: Number(postId)
            }
        });

        res.status(200).json({
            bookmark,
            message: 'Bookmarked successfully'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" })
        }
        const bookmark = await prisma.bookmark.delete({
            where: {
                postId_userId: {
                    postId: Number(req.params.id),
                    userId: Number(userId)
                }
            }
        })
        res.status(200).json({
            bookmark,
            message: 'Removed bookmark successfully'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId: Number(userId),
            },
            select: {
                id: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            },
        })
        res.status(200).json(bookmarks);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export {
    bookmarkPost,
    removeBookmark,
    getBookmarks
}