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
exports.getBookmarks = exports.removeBookmark = exports.bookmarkPost = void 0;
const Client_1 = __importDefault(require("../db/Client"));
const bookmarkPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { postId } = req.body;
        if (!postId) {
            res.status(400).json({ message: "Post ID is required" });
            return;
        }
        const bookmark = yield Client_1.default.bookmark.create({
            data: {
                userId: Number(userId),
                postId: Number(postId)
            }
        });
        res.status(200).json({
            bookmark,
            message: 'Bookmarked successfully'
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.bookmarkPost = bookmarkPost;
const removeBookmark = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const bookmark = yield Client_1.default.bookmark.delete({
            where: {
                postId_userId: {
                    postId: Number(req.params.id),
                    userId: Number(userId)
                }
            }
        });
        res.status(200).json({
            bookmark,
            message: 'Removed bookmark successfully'
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.removeBookmark = removeBookmark;
const getBookmarks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const bookmarks = yield Client_1.default.bookmark.findMany({
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
        });
        res.status(200).json(bookmarks);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getBookmarks = getBookmarks;
