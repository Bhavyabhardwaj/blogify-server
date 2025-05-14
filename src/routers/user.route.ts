import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware";
import { getUser, updateUserProfile } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", authenticateJWT, getUser);
userRouter.put("/updateUserProfile", authenticateJWT, updateUserProfile);

export default userRouter;
