import express from "express";
import morgan from "morgan";
import cors from "cors";
import { endpointError, generalError } from "./middlewares/error/errors";
import userRouter from "./routers/userRouter";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);

app.use(endpointError);
app.use(generalError);

export default app;
