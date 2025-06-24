"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRouter = void 0;
const express_1 = require("express");
const like_controller_1 = require("../controllers/like.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const likeRouter = (0, express_1.Router)();
exports.likeRouter = likeRouter;
likeRouter.post("/:id", auth_middleware_1.default, like_controller_1.likePost);
likeRouter.delete("/:id", auth_middleware_1.default, like_controller_1.unlikePost);
likeRouter.get("/", auth_middleware_1.default, like_controller_1.getLikes);
