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
exports.getLikes = exports.unlikePost = exports.likePost = void 0;
const Client_1 = __importDefault(require("../db/Client"));
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const postId = Number(req.params.id);
        // Check if like already exists
        const existingLike = yield Client_1.default.like.findFirst({
            where: { authorId: userId, postId }
        });
        if (existingLike) {
            res.status(200).json({ message: "Already liked" });
            return;
        }
        const like = yield Client_1.default.like.create({
            data: {
                author: { connect: { id: userId } },
                post: { connect: { id: postId } },
            }
        });
        res.status(200).json({ like, message: 'Liked successfully' });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.likePost = likePost;
const unlikePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const like = yield Client_1.default.like.findFirst({
            where: {
                authorId: Number(userId),
                postId: Number(req.params.id),
            }
        });
        if (!like) {
            res.status(404).json({ message: "Post not found" });
        }
        const unlike = yield Client_1.default.like.delete({ where: { id: like.id } });
        res.status(200).json({ unlike, message: 'Unliked successfully' });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.unlikePost = unlikePost;
const getLikes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const likes = yield Client_1.default.like.findMany({
            where: {
                authorId: Number(userId),
            },
            select: {
                id: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                    }
                }
            },
        });
        res.status(200).json(likes);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getLikes = getLikes;
