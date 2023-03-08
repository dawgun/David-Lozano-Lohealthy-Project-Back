import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import createGameValidation from "../../../schemas/gameCredentialsSchema";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  getGamesByUser,
  searchGames,
} from "../../controllers/gameControllers/gameControllers";
import imageStorage from "../../middlewares/imageStorage/imageStorage";
import resizeSharp from "../../middlewares/resizeSharp/resizeSharp";
import userAuthentification from "../../middlewares/userAuthentification/userAuthentification";

const gameRouter = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5000000 } });

gameRouter.get("/", getAllGames);
gameRouter.get("/my-list", userAuthentification, getGamesByUser);
gameRouter.get("/search", searchGames);
gameRouter.get("/:idGame", getGameById);

gameRouter.post(
  "/create",
  upload.single("image"),
  resizeSharp,
  validate(createGameValidation, {}, { abortEarly: false }),
  userAuthentification,
  imageStorage,
  createGame
);
gameRouter.delete("/delete/:idGame", userAuthentification, deleteGame);

export default gameRouter;
