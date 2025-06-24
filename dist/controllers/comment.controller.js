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
exports.createComment = exports.getComments = void 0;
const Client_1 = __importDefault(require("../db/Client"));
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const comments = yield Client_1.default.comment.findMany({
            where: {
                postId: Number(req.params.id),
            },
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
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(comments);
    }
    catch (err) {
        next(err);
    }
});
exports.getComments = getComments;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ message: "Comment content is required" });
            return;
        }
        const comment = yield Client_1.default.comment.create({
            data: {
                content,
                author: {
                    connect: { id: Number(userId) },
                },
                post: {
                    connect: { id: Number(req.params.id) },
                },
            },
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
            }
        });
        res.status(201).json({
            comment,
            message: 'Comment created successfully'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createComment = createComment;
