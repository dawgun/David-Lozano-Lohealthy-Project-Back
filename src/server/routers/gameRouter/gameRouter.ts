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
  updateGame,
} from "../../controllers/gameControllers/gameControllers";
import gameOwnerChecker from "../../middlewares/gameOwnerChecker/gameOwnerChecker";
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
gameRouter.patch(
  "/update",
  upload.single("image"),
  resizeSharp,
  userAuthentification,
  imageStorage,
  gameOwnerChecker,
  updateGame
);
gameRouter.delete(
  "/delete/:idGame",
  userAuthentification,
  gameOwnerChecker,
  deleteGame
);

export default gameRouter;
