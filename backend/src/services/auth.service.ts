import prisma from "../db-prisma/client";
import { AppError } from "../utils/AppError";
import { comparePasswords, hashPassword } from "../utils/hashPassword";
import { loginSchema, signupSchema } from "../utils/zodSchemas";
import { generateAccessToken, generateRefreshToken } from "./token.service";

export const createAccount = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
) => {
    try {
        const validatedData = signupSchema.parse({
            username,
            email,
            password,
            confirmPassword,
        });

        const hashedPassword = await hashPassword(validatedData.password);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    { email: validatedData.email },
                ],
            },
        });

        if (existingUser) {
            if (existingUser.username === validatedData.username) {
                throw new AppError("Username already exists.", 400);
            }
            if (existingUser.email == validatedData.email) {
                throw new AppError("Email already registered.", 400);
            }
        }

        const user = await prisma.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: hashedPassword,
            },
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof AppError) {
            throw error
        }
        throw new AppError("An error occured while creating the account.", 500)
    }
};

export const loginUser = async (
    email: string,
    password: string,
) => {
    try {
        const validatedData = loginSchema.parse({ email, password });

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) throw new AppError("Email is not registered.", 404);

        const isPasswordValid = await comparePasswords(validatedData.password, user.password);

        if (!isPasswordValid) throw new AppError("Wrong password", 401);

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        return { accessToken, refreshToken }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("An error occured during login", 500);
    }
}