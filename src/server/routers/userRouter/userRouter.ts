import express from "express";
import { validate } from "express-validation";
import { registerValidation } from "../../../schemas/userCredentialsSchema";
import {
  userLogin,
  userRegister,
} from "../../controllers/userControllers/userControllers";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(registerValidation, {}, { abortEarly: false }),
  userRegister
);

userRouter.post("/login", userLogin);

export default userRouter;
