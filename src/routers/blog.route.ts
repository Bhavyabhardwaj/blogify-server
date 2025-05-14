import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware";
import { getBlogs, createBlog, getBlog, updateBlog, deleteBlog, getAllPosts } from "../controllers/blog.controller";

const blogRouter = Router();

blogRouter.get("/", authenticateJWT, getBlogs);
blogRouter.get("/all", authenticateJWT, getAllPosts);
blogRouter.get("/:id", authenticateJWT, getBlog);
blogRouter.put("/:id", authenticateJWT, updateBlog);
blogRouter.delete("/:id", authenticateJWT, deleteBlog);
blogRouter.post("/", authenticateJWT, createBlog);


export default blogRouter;