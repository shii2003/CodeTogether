import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import { AppError } from "../utils/AppError";

export const generateAccessToken = (id: number): string => {
    return jwt.sign(
        { id },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
};

export const generateRefreshToken = (id: number): string => {
    return jwt.sign(
        { id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
};

export const verifyRefreshToken = (token: string): { id: number } => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: number };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Refresh token expired.", 401);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid refresh token.", 401)
        }
        throw new AppError("An error occured whileverifying the refresh token.", 500);
    }
}
