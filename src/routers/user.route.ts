import express from 'express';
import { getUser, updateUser } from '../controllers/user.controller';
import authenticateToken from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/profile', authenticateToken, getUser);
router.put('/profile', authenticateToken, updateUser);
router.get('/me', authenticateToken, getUser);

export default router;
