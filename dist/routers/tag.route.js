"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tag_controller_1 = require("../controllers/tag.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const tagRouter = (0, express_1.Router)();
tagRouter.post("/", auth_middleware_1.default, tag_controller_1.createTag);
tagRouter.post("/:tagId/posts", auth_middleware_1.default, tag_controller_1.addTagToPost);
tagRouter.get("/:tagId/posts", auth_middleware_1.default, tag_controller_1.getPostsByTag);
exports.default = tagRouter;
