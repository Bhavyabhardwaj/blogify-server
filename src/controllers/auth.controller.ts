import { hashPassword, comparePassword } from "../utils/bcrypt";
import prisma from "../prisma/Client";
import { generateToken, verifyToken } from "../utils/jwt";
import { Request, Response } from "express";
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

const register = async (req: Request, res: Response) => {
    try {
        const userResponse = UserSchema.safeParse(req.body);
        if (!userResponse.success) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const { email, password, username } = userResponse.data;

        if (!email || !password || !username) {
            throw new Error('Please give all inputs');
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username
            },
        });

        const token = generateToken(user.id);

        res.status(201).json({ token });

    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const userResponse = LoginSchema.safeParse(req.body);
        if (!userResponse.success) {
            throw new Error('Invalid request body');
        }

        const { email, password } = userResponse.data;

        if (!email || !password) {
            throw new Error('Please give all inputs');
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = generateToken(user.id);

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });

    }
};

export {
    register,
    login
}
