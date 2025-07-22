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

// Configure CORS for production and development
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://blogify.bhavya.live',
  'https://blogify-c.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000', 
  'http://localhost:8080',
];
app.use(cors({
    origin: allowedOrigins,
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

