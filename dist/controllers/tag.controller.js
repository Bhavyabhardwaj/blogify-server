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
exports.getPostsByTag = exports.addTagToPost = exports.createTag = void 0;
const Client_1 = __importDefault(require("../db/Client"));
const createTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const tag = yield Client_1.default.tag.create({
            data: {
                name: req.body.name,
            }
        });
        res.status(200).json({
            tag,
            message: 'Tag created successfully'
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createTag = createTag;
const addTagToPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [post, tag] = yield Promise.all([
            Client_1.default.post.findUnique({ where: { id: parsedPostId } }),
            Client_1.default.tag.findUnique({ where: { id: parsedTagId } }),
        ]);
        if (!post || !tag) {
            res.status(404).json({ message: "Post or Tag not found" });
        }
        const postTag = yield Client_1.default.postTag.create({
            data: {
                postId: parsedPostId,
                tagId: parsedTagId,
            },
        });
        res.status(200).json({ postTag, message: "Tag added to post" });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.addTagToPost = addTagToPost;
const getPostsByTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagId = parseInt(req.params.tagId);
        if (isNaN(tagId)) {
            res.status(400).json({ message: "Invalid tag ID" });
        }
        const posts = yield Client_1.default.post.findMany({
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
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getPostsByTag = getPostsByTag;
