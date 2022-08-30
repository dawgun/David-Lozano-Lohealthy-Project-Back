import express from "express";
import { validate } from "express-validation";
import registerValidation from "../../schemas/userCredentialsSchema";
import userRegister from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(registerValidation, {}, { abortEarly: false }),
  userRegister
);

export default userRouter;
