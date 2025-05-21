import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routers/auth.route';
import userRouter from './routers/user.route';
import blogRouter from './routers/blog.route';
import commentRouter from './routers/comment.route';
import { likeRouter } from './routers/like.route';
import bookmarkRouter from './routers/bookmark.route';
import errorHandler from './middlewares/errorHandler';
import tagRouter from './routers/tag.route';

dotenv.config();
const app = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'https://blogify-bhavya.up.railway.app', 'https://blogify-client-8n6n69v5d-bhavya-bhardwajs-projects.vercel.app', 'https://blogify-client-o92dcctty-bhavya-bhardwajs-projects.vercel.app', 'https://blogify-client-blue.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/test', (req, res) => {
    res.send('Helllo from server side');
})

app.use('/api/auth', router)
app.use('/api/user', userRouter)
app.use('/api/posts', blogRouter)
app.use('/api/comments', commentRouter)
app.use('/api/likes', likeRouter)
app.use('/api/bookmarks', bookmarkRouter)
app.use('/api/tags', tagRouter)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

