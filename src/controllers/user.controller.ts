import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
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
                avatarUrl: true,
                _count: {
                    select: {
                        posts: true,
                        bookmarks: true,
                        likes: true
                    }
                },
                posts: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                bookmarks: {
                    select: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                createdAt: true,
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
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Return the response in the format expected by the frontend
        res.status(200).json({
            id: user.id,
            name: user.username,
            bio: user.bio,
            avatar: user.avatarUrl,
            email: user.email,
            stats: {
                posts: user._count.posts,
                bookmarks: user._count.bookmarks,
                likes: user._count.likes
            },
            posts: user.posts,
            bookmarks: user.bookmarks
        });
    }
    catch (err) {
        next(err);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { username, bio } = req.body;

        // First check if username is already taken
        if (username) {
            const existingUser = await prisma.user.findFirst({
                // if someone tries to update the username and it's taken it check's this condition
                where: {
                    username,
                    id: { not: Number(userId) }  // Find a user whose ID is not equal to the currently logged-in user
                }
            });

            if (existingUser) {
                res.status(400).json({ message: "Username is already taken" });
                return;
            }
        }

        const updateData: any = {
            username,
            bio,
        };

        const user = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: updateData,
            select: {
                id: true,
                email: true,
                username: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        res.status(200).json({ user, message: 'User updated successfully' });
    } catch (err) {
        next(err);
    }
};

export { getUser, updateUser };