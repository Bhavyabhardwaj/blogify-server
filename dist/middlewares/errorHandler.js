"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof errors_1.CustomError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        res.status(400).json({ message: 'Database error occurred' });
        return;
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
        return;
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    // Handle all other errors
    res.status(500).json({ message: 'Internal server error' });
};
exports.default = errorHandler;
