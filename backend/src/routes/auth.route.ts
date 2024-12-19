import { Router } from "express";
import { signupHandler, loginHandler, logoutHandler } from "../controllers/auth.controller";
import { verifyAccessTokenMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);

router.post("/logout", verifyAccessTokenMiddleware, logoutHandler)

export default router;