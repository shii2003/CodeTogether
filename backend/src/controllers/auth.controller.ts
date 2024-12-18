import { Request, Response, NextFunction } from "express";
import { createAccount, loginUser } from "../services/auth.service";
import { loginSchema } from "../utils/zodSchemas";

export const signupHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const tokens = await createAccount(username, email, password, confirmPassword);
        res.status(201).json({ message: "User registered successfully", tokens });

    } catch (error) {
        next(error);
    }
}


export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const tokens = await loginUser(email, password);
        res.status(200).json({ message: "Login successfull", tokens });
    } catch (error) {
        next(error);
    }
};