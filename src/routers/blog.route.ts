import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware";
import { getBlogs, createBlog } from "../controllers/blog.controller";

const blogRouter = Router();

blogRouter.get("/", authenticateJWT, getBlogs);
blogRouter.post("/", authenticateJWT, createBlog);

export default blogRouter;