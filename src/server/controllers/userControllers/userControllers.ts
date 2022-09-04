import { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User";
import CustomJwtPayload from "../../../types/payload";
import { LohealthyUser, LoginUser, DatabaseUser } from "../../../types/user";
import {
  hashCreator,
  hashCompare,
  createToken,
} from "../../../utils/auth/auth";
import CustomError from "../../../utils/CustomError/CustomError";

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData: LohealthyUser = req.body;
  userData.password = await hashCreator(userData.password);

  try {
    await User.create(userData);

    res.status(201).json({ message: "User created" });
  } catch (error) {
    const customError = new CustomError(
      400,
      error.message,
      "Error creating new user"
    );
    next(customError);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: LoginUser = req.body;
  const userError = new CustomError(
    403,
    "User not found",
    "User or password not valid"
  );

  let findUser: DatabaseUser;

  try {
    findUser = await User.findOne({ userName: user.userName });
    if (!findUser) {
      next(userError);
      return;
    }
  } catch (error) {
    const customMongooseError = new CustomError(
      403,
      (error as Error).message,
      "User or password invalid"
    );
    next(customMongooseError);
    return;
  }

  try {
    const isPasswordValid = await hashCompare(user.password, findUser.password);
    if (!isPasswordValid) {
      userError.privateMessage = "Password invalid";
      next(userError);
      return;
    }
  } catch (error) {
    const hashError = new CustomError(
      403,
      (error as Error).message,
      "User or password not valid "
    );
    next(hashError);
    return;
  }

  const payLoad: CustomJwtPayload = {
    id: findUser.id,
    userName: findUser.userName,
    image: findUser.image,
  };

  const responseData = {
    token: createToken(payLoad),
  };

  res.status(200).json(responseData);
};
