import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
};

export default errorHandler;