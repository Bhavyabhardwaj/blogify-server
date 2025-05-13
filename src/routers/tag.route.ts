import { Router } from "express";
import { createTag, addTagToPost, getPostsByTag } from "../controllers/tag.controller";
import authenticateJWT from "../middlewares/auth.middleware";

const tagRouter = Router();

tagRouter.post("/", authenticateJWT, createTag);
tagRouter.post("/:tagId/posts", authenticateJWT, addTagToPost);
tagRouter.get("/:tagId/posts", authenticateJWT, getPostsByTag);

export default tagRouter;