import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import app from ".";
import CustomError from "../utils/CustomError/CustomError";

const debug = Debug("lohealthygames:server:startServer");

const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server listening on http://localhost:${port}`));
      resolve(true);
    });

    server.on("error", (error: CustomError) => {
      debug(chalk.red("Error starting the server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`Port ${port} in use`));
      }
      reject(error);
    });
  });

export default startServer;
