import "../../../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import { Request, Response } from "express";

const debug = Debug("lohealthy:server:middlewares/errors");

const endpointError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });

  debug(chalk.red("Client sends an unknown endpoint"));
};

export default endpointError;
