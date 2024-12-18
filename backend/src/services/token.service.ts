import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";

export const generateAccessToken = (userId: number): string => {
    return jwt.sign(
        { userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
};

export const generateRefreshToken = (userId: number): string => {
    return jwt.sign(
        { userId },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
};
