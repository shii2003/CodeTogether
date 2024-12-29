import { Router } from "express";
import { signupHandler, loginHandler, logoutHandler, regenerateAccessToken, getUser, UnauthenticatedLogout } from "../controllers/auth.controller";
import { verifyAccessTokenMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);


router.post("/logout", verifyAccessTokenMiddleware, logoutHandler)
router.get("/me", verifyAccessTokenMiddleware, getUser);

router.post("/regenerateAccessToken", regenerateAccessToken);
router.post("/unauthenticatedLogout", UnauthenticatedLogout)


export default router;