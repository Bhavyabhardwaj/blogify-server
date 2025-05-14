import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const calculateReadingTime = (content: string): number => {
    const words = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
};

const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
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
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            },
        });
        res.status(200).json(blogs);
    }
    catch (err) {
        console.log(err);
        next(err);
    }

}

const getBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const blog = await prisma.post.findUnique({
            where: {
                id: Number(req.params.id),
                authorId: Number(userId),
            },
            select: {
                id: true,
                title: true,
                content: true,
                readingTime: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        })
        res.status(200).json(blog);
    }
    catch (err) {
        console.log(err);
        next(err);
    }

}

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const readingTime = calculateReadingTime(req.body.content);

        const blog = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                readingTime: readingTime,
                author: {
                    connect: { id: Number(userId) },
                },
            },
        })
        res.status(200).json({ blog, message: 'Blog created successfully' });
    }
    catch (err) {
        console.log(err);
        next(err);
    }

}

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const blog = await prisma.post.update({
            where: {
                id: Number(req.params.id),
                authorId: Number(userId),
            },
            data: {
                title: req.body.title,
                content: req.body.content,
            },
        })
        res.status(200).json({ blog, message: 'Blog updated successfully' });
    }
    catch (err) {
        console.log(err);
        next(err);
    }

}

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const blog = await prisma.post.delete({
            where: {
                id: Number(req.params.id),
                authorId: Number(userId),
            },
        })
        res.status(200).json({ blog, message: 'Blog deleted successfully' });
    }
    catch (err) {
        console.log(err);
        next(err);
    }

}
const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sortBy = "date", tag } = req.query;

        // Build order
        let orderBy = {};
        if (sortBy === "likes") {
            orderBy = {
                likes: {
                    _count: "desc", // assuming Post has a likes relation
                },
            };
        } else {
            orderBy = {
                createdAt: "desc",
            };
        }

        // Build where condition if tag filter exists
        const whereCondition = tag
            ? {
                tags: {
                    some: {
                        tag: {
                            name: String(tag),
                        },
                    },
                },
            }
            : {};

        const posts = await prisma.post.findMany({
            where: whereCondition,
            orderBy,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
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
                    },
                },
            },
        });

        res.status(200).json({ posts });
    } catch (err) {
        console.log(err);
        next(err);
    }
};


export { getBlogs, createBlog, getBlog, updateBlog, deleteBlog, getAllPosts };