"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookmark_controller_1 = require("../controllers/bookmark.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const bookmarkRouter = (0, express_1.Router)();
bookmarkRouter.get("/", auth_middleware_1.default, bookmark_controller_1.getBookmarks);
bookmarkRouter.post("/", auth_middleware_1.default, bookmark_controller_1.bookmarkPost);
bookmarkRouter.delete("/:id", auth_middleware_1.default, bookmark_controller_1.removeBookmark);
exports.default = bookmarkRouter;
