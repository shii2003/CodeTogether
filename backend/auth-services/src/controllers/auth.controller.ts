import { Request, Response, NextFunction, request } from "express";
import { createAccount, loginUser } from "../services/auth.service";
import { loginSchema } from "../utils/zodSchemas";

import { AppError } from "../utils/AppError";
import prisma from "../db-prisma/client";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../services/token.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const options = {
    httpOnly: true,
    secure: true
}

export const signupHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const { user, accessToken, refreshToken } = await createAccount(username, email, password, confirmPassword);


        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    message: "User registered successfully",
                    user,
                }
            );

    } catch (error) {
        next(error);
    }
}


export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await loginUser(email, password);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    message: "Login successfull",
                    user,
                }
            );
    } catch (error) {
        next(error);
    }
};

export const logoutHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError(
                "User not logged in.",
                401
            )
        }
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });

        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({ message: "Logged out Successfully." })
    } catch (error) {
        next(error)
    }
}

//this api is only for testing purposes delete this in production
export const UnauthenticatedLogout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({ message: "Logged out Successfully." })
}
export const getUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user
    if (!user) {
        throw new AppError(
            "User not logged in.",
            401
        )
    }

    return res
        .status(200)
        .json({
            message: "User details returned succefully",
            user
        })
}
export const regenerateAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            throw new AppError(
                "unauthorized request",
                401
            )
        }

        const decodedUser = verifyRefreshToken(incomingRefreshToken);

        const user = await prisma.user.findUnique({
            where: { id: decodedUser.id },
        });

        if (!user) {
            throw new AppError("Invalid refersh token", 404);
        }
        if (user.refreshToken !== incomingRefreshToken) {
            throw new AppError("refresh token is expired or used", 401);
        }

        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                {
                    message: "access token regenerated successfully",
                }
            )
    } catch (error) {
        next(error)
    }
}