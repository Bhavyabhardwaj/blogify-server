import { Request, Response, NextFunction } from "express";
import prisma from "../db/Client";

const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const tag = await prisma.tag.create({
            data: {
                name: req.body.name,
            }
        })
        res.status(200).json({
            tag,
            message: 'Tag created successfully'
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const addTagToPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, tagId } = req.body;

        // Convert to numbers
        const parsedPostId = parseInt(postId);
        const parsedTagId = parseInt(tagId);

        // Check if both IDs are valid numbers
        if (isNaN(parsedPostId) || isNaN(parsedTagId)) {
            res.status(400).json({ message: "Invalid postId or tagId" });
        }

        // Check if tag and post exist
        const [post, tag] = await Promise.all([
            prisma.post.findUnique({ where: { id: parsedPostId } }),
            prisma.tag.findUnique({ where: { id: parsedTagId } }),
        ]);

        if (!post || !tag) {
            res.status(404).json({ message: "Post or Tag not found" });
        }

        const postTag = await prisma.postTag.create({
            data: {
                postId: parsedPostId,
                tagId: parsedTagId,
            },
        });

        res.status(200).json({ postTag, message: "Tag added to post" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getPostsByTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tagId = parseInt(req.params.tagId);
        if (isNaN(tagId)) {
            res.status(400).json({ message: "Invalid tag ID" });
        }

        const posts = await prisma.post.findMany({
            where: {
                tags: {
                    some: {
                        tagId: tagId,
                    },
                },
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
                },
                tags: {
                    select: {
                        id: true,
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }, 
            },
            
            });

        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export { createTag, addTagToPost, getPostsByTag };