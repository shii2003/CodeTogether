import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void | Response => {
    console.error("Internal Error:", error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message })
    }
    res.status(500).json({ error: "Something went wrong" });
}