"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.deleteBlog = exports.updateBlog = exports.getBlog = exports.createBlog = exports.getBlogs = void 0;
const Client_1 = __importDefault(require("../db/Client"));
const calculateReadingTime = (content) => {
    const words = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
};
const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const blogs = yield Client_1.default.post.findMany({
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
});
exports.getBlogs = getBlogs;
const getBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const blog = yield Client_1.default.post.findFirst({
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
});
exports.getBlog = getBlog;
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { title, content } = req.body;
        const readingTime = calculateReadingTime(content);
        const blog = yield Client_1.default.post.create({
            data: {
                title,
                content,
                readingTime,
                author: { connect: { id: Number(userId) } },
            },
        });
        res.status(201).json({ blog, message: "Blog created successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updateData = {
            title: req.body.title,
            content: req.body.content,
        };
        const blog = yield Client_1.default.post.update({
            where: {
                id: Number(req.params.id),
                authorId: Number(userId),
            },
            data: updateData,
        });
        res.status(200).json({ blog, message: 'Blog updated successfully' });
    }
    catch (err) {
        next(err);
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const post = yield Client_1.default.post.findUnique({
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
        yield Client_1.default.postTag.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Delete all likes for this post
        yield Client_1.default.like.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Delete all comments for this post
        yield Client_1.default.comment.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Delete all bookmarks for this post
        yield Client_1.default.bookmark.deleteMany({
            where: { postId: Number(req.params.id) }
        });
        // Now delete the post
        yield Client_1.default.post.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json({ message: 'Blog deleted successfully' });
        return;
    }
    catch (err) {
        console.error("Error deleting post:", err);
        next(err);
    }
});
exports.deleteBlog = deleteBlog;
const getAllPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else {
            orderBy = {
                createdAt: "desc",
            };
        }
        const whereCondition = {};
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
        const posts = yield Client_1.default.post.findMany({
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
    }
    catch (err) {
        next(err);
    }
});
exports.getAllPosts = getAllPosts;
