import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import createGameValidation from "../../../schemas/gameCredentialsSchema";
import {
  createGame,
  deleteGame,
  getAllGames,
} from "../../controllers/gameControllers/gameControllers";
import userAuthentification from "../../middlewares/userAuthentification/userAuthentification";

const gameRouter = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5000000 } });

gameRouter.get("/", getAllGames);
gameRouter.post(
  "/create",
  upload.single("image"),
  validate(createGameValidation, {}, { abortEarly: false }),
  userAuthentification,
  createGame
);
gameRouter.delete("/delete/:idGame", deleteGame);

export default gameRouter;
