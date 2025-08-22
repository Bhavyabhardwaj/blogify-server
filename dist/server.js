"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routers/auth.route"));
const user_route_1 = __importDefault(require("./routers/user.route"));
const blog_route_1 = __importDefault(require("./routers/blog.route"));
const comment_route_1 = __importDefault(require("./routers/comment.route"));
const like_route_1 = require("./routers/like.route");
const bookmark_route_1 = __importDefault(require("./routers/bookmark.route"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const tag_route_1 = __importDefault(require("./routers/tag.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configure CORS for production and development
const allowedOrigins = [
    process.env.CLIENT_URL || 'https://blogifyy.bhavya.live',
    'https://blogify-c.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.get('/test', (req, res) => {
    res.send('Helllo from server side');
});
app.use('/api/auth', auth_route_1.default);
app.use('/api/user', user_route_1.default);
app.use('/api/posts', blog_route_1.default);
app.use('/api/comments', comment_route_1.default);
app.use('/api/likes', like_route_1.likeRouter);
app.use('/api/bookmarks', bookmark_route_1.default);
app.use('/api/tags', tag_route_1.default);
app.use(errorHandler_1.default);
const PORT = Number(process.env.PORT) || 4000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
