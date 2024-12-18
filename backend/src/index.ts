import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { PORT, APP_ORIGIN } from "./constants/env";
import authRoutes from "./routes/auth.route"
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors({
    origin: APP_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use("/api/auth", authRoutes)
app.use(errorHandler)

app.get('/', (req, res) => {
    res.status(200).json({
        status: "healthy",
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in development env`)
})