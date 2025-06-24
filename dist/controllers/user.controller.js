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
exports.updateUser = exports.getUser = void 0;
const Client_1 = __importDefault(require("../db/Client"));
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = yield Client_1.default.user.findUnique({
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
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { username, bio } = req.body;
        // First check if username is already taken
        if (username) {
            const existingUser = yield Client_1.default.user.findFirst({
                // if someone tries to update the username and it's taken it check's this condition
                where: {
                    username,
                    id: { not: Number(userId) } // Find a user whose ID is not equal to the currently logged-in user
                }
            });
            if (existingUser) {
                res.status(400).json({ message: "Username is already taken" });
                return;
            }
        }
        const updateData = {
            username,
            bio,
        };
        const user = yield Client_1.default.user.update({
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
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
