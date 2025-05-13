import { Router } from "express";
import { likePost, unlikePost, getLikes } from "../controllers/like.controller";
import authenticateJWT from "../middlewares/auth.middleware";

const likeRouter = Router();

likeRouter.post("/:id", authenticateJWT, likePost);
likeRouter.delete("/:id", authenticateJWT, unlikePost);
likeRouter.get("/", authenticateJWT, getLikes);

export { likeRouter };