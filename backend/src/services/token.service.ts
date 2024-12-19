import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";

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
