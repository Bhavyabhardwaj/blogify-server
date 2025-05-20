import { hashPassword, comparePassword } from "../utils/bcrypt";
import prisma from "../db/Client";
import { generateToken, verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
})

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const register = async (req: Request, res: Response, next: NextFunction) => {
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
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                bio: '',
                avatarUrl: '',
            },
        });

        const token = generateToken(user.id);

        return res.status(201).json({ token, message: 'User created successfully' });
    }
    catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userResponse = LoginSchema.safeParse(req.body);
        if (!userResponse.success) {
            return res.status(400).json({ 
                error: 'Invalid request body', 
                issues: userResponse.error.errors 
            });
        }

        const { email, password } = userResponse.data;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user.id);

        return res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    register,
    login
}
