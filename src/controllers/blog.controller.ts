import { Request, Response } from "express";
import prisma from "../db/Client";

const calculateReadingTime = (content: string): number => {
    const words = content.split(/\s+/).length;  
    const wordsPerMinute = 200;  
    return Math.ceil(words / wordsPerMinute);  
};

const getBlogs = async (req: Request, res: Response) => {
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

const createBlog = async (req: Request, res: Response) => {
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

export { getBlogs, createBlog };