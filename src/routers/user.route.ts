import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware";
import { getUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", authenticateJWT, getUser);

export default userRouter;
