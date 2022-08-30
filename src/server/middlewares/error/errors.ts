import "../../../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../../utils/CustomError/CustomError";

const debug = Debug("lohealthygames:server:middlewares/errors");

export const endpointError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });

  debug(chalk.red("Client sends an unknown endpoint"));
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  let errorMessage = error.publicMessage ?? "Everything has peted";

  if (error instanceof ValidationError) {
    debug(chalk.red("Request validation error: "));
    error.details.body.forEach((errorInfo) =>
      debug(chalk.red(errorInfo.message))
    );
    errorMessage = "Wrong data";
  }

  debug(chalk.red(error.message));

  res.status(errorCode).json({ error: errorMessage });
};
