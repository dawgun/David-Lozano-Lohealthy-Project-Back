import express from "express";
import userRegister from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.post("/register", userRegister);

export default userRouter;
