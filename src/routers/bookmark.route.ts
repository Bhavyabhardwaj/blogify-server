import { Router } from "express";
import { getBookmarks, bookmarkPost, removeBookmark } from "../controllers/bookmark.controller";
import authenticateJWT from "../middlewares/auth.middleware";

const bookmarkRouter = Router();

bookmarkRouter.get("/", authenticateJWT, getBookmarks);
bookmarkRouter.post("/", authenticateJWT, bookmarkPost);
bookmarkRouter.delete("/:id", authenticateJWT, removeBookmark);

export default bookmarkRouter;