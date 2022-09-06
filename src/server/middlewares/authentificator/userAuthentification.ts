import { NextFunction, Response } from "express";
import CustomJwtPayload from "../../../types/payload";
import CustomRequest from "../../../types/customRequest";
import { verifyToken } from "../../../utils/auth/auth";
import CustomError from "../../../utils/CustomError/CustomError";

const userAuthentification = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const customError = new CustomError(400, "Bad Login", "User sends bad login");

  const requestAuthentification = req.get("Authorization");

  if (
    !requestAuthentification ||
    !requestAuthentification.startsWith("Bearer ")
  ) {
    next(customError);
    return;
  }
  const token = requestAuthentification.slice(7);
  const userToken = verifyToken(token);

  if (typeof userToken === "string") {
    next(customError);
    return;
  }

  req.payload = userToken as CustomJwtPayload;
  next();
};

export default userAuthentification;
