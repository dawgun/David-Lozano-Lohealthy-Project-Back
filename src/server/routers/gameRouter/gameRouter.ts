import express from "express";
import getAllGames from "../../controllers/gameControllers/gameControllers";

const gameRouter = express.Router();

gameRouter.get("/", getAllGames);

export default gameRouter;
