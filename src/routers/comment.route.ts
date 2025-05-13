import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware";
import { getComments, createComment } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.get("/:id", authenticateJWT, getComments);
commentRouter.post("/:id", authenticateJWT, createComment);

export default commentRouter;