import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, getAllPosts } from '../controllers/blog.controller';
import authenticateToken from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', getAllPosts);
router.get('/', authenticateToken, getBlogs);
router.get('/:id', authenticateToken, getBlog);
router.post('/', authenticateToken, createBlog);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

export default router;