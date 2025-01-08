import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, defaulValue?: string) => {
    const value = process.env[key] || defaulValue;

    if (value === undefined) {
        throw Error(`Missing String environment variable for ${key}`);
    }
    return value;
};

export const REDIS_CONNECTION_URL = getEnv("REDIS_CONNECTION_URL");
export const PORT = getEnv("PORT", "8080");