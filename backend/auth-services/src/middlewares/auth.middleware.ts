import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/env";
import { AppError } from "../utils/AppError";
import prisma from "../db-prisma/client";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        username: string;
        email: string
    }
}

interface CustomeJwtPayload extends JwtPayload {
    id: number;
}

export const verifyAccessTokenMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AppError(
                "Unauthorized request",
                401
            )
        }
        const decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET) as CustomeJwtPayload;
        console.log("Decoded User:", decodedUser)
        if (!decodedUser) {
            throw new AppError(
                "Invalid access token.",
                401
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedUser.id }
        });

        if (!user) {
            throw new AppError(
                "User not found.",
                404
            )
        }
        const { password: _, refreshToken: __, ...userDetails } = user;
        req.user = userDetails;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                new AppError(
                    "Invalid or expired access token",
                    401
                ));
        }
        next(error);
    }
}