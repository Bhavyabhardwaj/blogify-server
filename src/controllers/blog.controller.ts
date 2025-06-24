import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const calculateReadingTime = (content: string): number => {
    const words = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
};

const getBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const blogs = await prisma.post.findMany({
            where: {
                authorId: Number(userId),
            },
            select: {
                id: true,
                title: true,
                content: true,
                readingTime: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            },
        });
        res.status(200).json(blogs);
    }
    catch (err) {
        next(err);
    }
}

const getBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                title: true,
                content: true,
                readingTime: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
                comments: {
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
                    // filter by descending order latest first
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
        });

        if (!blog) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json(blog);
    }
    catch (err) {
        next(err);
    }
}

const createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).json({ message: "Title and content are required" });
            return;
        }
        const readingTime = calculateReadingTime(content);

        const blog = await prisma.post.create({
            data: {
                title,
                content,
                readingTime,
                author: { connect: { id: Number(userId) } },
            },
        });

        res.status(201).json({ blog, message: "Blog created successfully" });
    } catch (err) {
        next(err);
    }
};

const updateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Check if post exists and belongs to user
        const post = await prisma.post.findUnique({
            where: { id: Number(req.params.id) },
            select: { id: true, authorId: true }
        });
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (String(post.authorId) !== String(userId)) {
            res.status(403).json({ message: "You are not allowed to update this post" });
            return;
        }

        const updateData: any = {
            title: req.body.title,
            content: req.body.content,
        };

        const blog = await prisma.post.update({
            where: {
                id: Number(req.params.id),
                // authorId: Number(userId), // already checked above
            },
            data: updateData,
        });
        res.status(200).json({ blog, message: 'Blog updated successfully' });
    }
    catch (err: any) {
        console.error('Update blog error:', err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
};

const deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const post = await prisma.post.findUnique({
            where: { id: Number(req.params.id) },
            select: { id: true, authorId: true }
        });
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (String(post.authorId) !== String(userId)) {
            res.status(403).json({ message: "You are not allowed to delete this post" });
            return;
        }
        // Delete all related PostTag entries
        await prisma.postTag.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Delete all likes for this post
        await prisma.like.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Delete all comments for this post
        await prisma.comment.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Delete all bookmarks for this post
        await prisma.bookmark.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Now delete the post
        await prisma.post.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json({ message: 'Blog deleted successfully' });
        return;
    }
    catch (err) {
        console.error("Error deleting post:", err);
        next(err);
    }
}

const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { sortBy = "date", tag, search } = req.query;

        // sort by likes or date
        let orderBy = {};
        if (sortBy === "likes") {
            orderBy = {
                likes: {
                    _count: "desc",
                },
            };
        } else {
            orderBy = {
                createdAt: "desc",
            };
        }

        const whereCondition: any = {};

        if (tag) {
            whereCondition.tags = {
                some: {
                    tag: {
                        name: {
                            equals: String(tag),
                            mode: "insensitive",
                        },
                    },
                },
            };
        }

        if (search) {
            whereCondition.title = {
                contains: String(search),
                mode: "insensitive",
            };
        }

        const posts = await prisma.post.findMany({
            where: whereCondition,
            orderBy,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            },
        });
        res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
};

export { getBlogs, createBlog, getBlog, updateBlog, deleteBlog, getAllPosts };