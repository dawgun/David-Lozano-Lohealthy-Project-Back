import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import endpointError from "./middlewares/error/errors";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/user", (req: Request, res: Response) => res.json("Lo haces bien"));

app.use(endpointError);

export default app;
