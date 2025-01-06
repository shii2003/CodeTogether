const getEnv = (key: string, defaulValue?: string) => {
    const value = process.env[key] || defaulValue;

    if (value === undefined) {
        throw Error(`Missing String environment variable for ${key}`);
    }
    return value;
};

export const PORT = getEnv("PORT", "5000");
export const POSTGRES_DATABASE_URL = getEnv("POSTGRES_DATABASE_URL");
export const REDIS_CONNECTION_URL = getEnv("REDIS_CONNECTION_URL");
export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");
export const APP_ORIGIN = getEnv("APP_ORIGIN")