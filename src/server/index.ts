import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => res.json("Lo haces bien"));

export default app;
