import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Internal Error:", error);

    if (error.statusCode && error.message) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
}