"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = require("../utils/bcrypt");
const Client_1 = __importDefault(require("../db/Client"));
const jwt_1 = require("../utils/jwt");
const zod_1 = require("zod");
const UserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    username: zod_1.z.string().min(3),
});
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userResponse = UserSchema.safeParse(req.body);
        if (!userResponse.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                issues: userResponse.error.errors
            });
        }
        const { email, password, username } = userResponse.data;
        // Check if user with this email already exists
        const existingUser = yield Client_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
        const user = yield Client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                bio: '',
                avatarUrl: '',
            },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        return res.status(201).json({ token, message: 'User created successfully' });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userResponse = LoginSchema.safeParse(req.body);
        if (!userResponse.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                issues: userResponse.error.errors
            });
        }
        const { email, password } = userResponse.data;
        const user = yield Client_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = yield (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = (0, jwt_1.generateToken)(user.id);
        return res.status(200).json({ token, message: 'Login successful' });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
