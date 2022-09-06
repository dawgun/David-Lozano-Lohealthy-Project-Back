import express from "express";
import {
  deleteGame,
  getAllGames,
} from "../../controllers/gameControllers/gameControllers";

const gameRouter = express.Router();

gameRouter.get("/", getAllGames);
gameRouter.delete("/delete/:idGame", deleteGame);

export default gameRouter;
