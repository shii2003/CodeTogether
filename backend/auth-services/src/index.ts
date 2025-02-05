import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Response } from "express";
import { Request } from "express";
import cors from "cors";
import { PORT, APP_ORIGIN } from "./constants/env";
import authRoutes from "./routes/auth.route"
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import { RedisManager } from "./RedisManager";

const app = express();

app.use(cors({
    origin: APP_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded(
    {
        extended: true,
        limit: "16kb"
    }));
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use((
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    errorHandler(err, req, res, next);
})

app.get('/', (req, res) => {
    res.status(200).json({
        status: "healthy",
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in development env`)
});

//Test code

(async () => {
    try {
        const redisManager = RedisManager.getInstance();

        const testMessage = {
            userId: "testUser123",
            action: "testAction",
            roomId: "testRoom456",
        }

        console.log("Sending test messages to room-service...");
        const response = await redisManager.sendAndAwait(testMessage);
        console.log("Response from room-service:", response);
    } catch (error) {
        console.log("Error in redis communication test:", error);
    }
})();