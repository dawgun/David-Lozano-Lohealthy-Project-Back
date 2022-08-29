import "./loadEnvironment";
import connectDB from "./database";
import startServer from "./server/startServer";

const port = +process.env.PORT || 4000;
const mongoURL = process.env.MONGODB_URL;

(async () => {
  try {
    await startServer(port);
    await connectDB(mongoURL);
  } catch (error) {
    process.exit(1);
  }
})();
