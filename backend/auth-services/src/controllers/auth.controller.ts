import { Request, Response, NextFunction } from "express";
import { createAccount, loginUser } from "../services/auth.service";
import { loginSchema } from "../utils/zodSchemas";
import { AutheticatedRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";
import prisma from "../db-prisma/client";

const options = {
    httpOnly: true,
    secure: true
}

export const signupHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const { accessToken, refreshToken } = await createAccount(username, email, password, confirmPassword);


        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    message: "User registered successfully",
                    tokens: { accessToken, refreshToken }
                }
            );

    } catch (error) {
        next(error);
    }
}


export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await loginUser(email, password);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    message: "Login successfull",
                    tokens: { accessToken, refreshToken }
                }
            );
    } catch (error) {
        next(error);
    }
};

export const logoutHandler = async (req: AutheticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.id; //extracting userId from middlware
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
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "Logged out Successfully." })
    } catch (error) {
        next(error)
    }
}