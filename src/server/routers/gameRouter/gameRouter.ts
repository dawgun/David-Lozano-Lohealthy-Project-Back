import express from "express";
import multer from "multer";
import {
  createGame,
  deleteGame,
  getAllGames,
} from "../../controllers/gameControllers/gameControllers";
import userAuthentification from "../../middlewares/userAuthentification/userAuthentification";

const gameRouter = express.Router();
const upload = multer({ dest: "uploads/" });

gameRouter.get("/", getAllGames);
gameRouter.post(
  "/create",
  upload.single("image"),
  userAuthentification,
  createGame
);
gameRouter.delete("/delete/:idGame", deleteGame);

export default gameRouter;
