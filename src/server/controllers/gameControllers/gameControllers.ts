import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import Game from "../../../database/models/Game";
import User from "../../../database/models/User";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let games;

  try {
    games = await Game.find();

    if (games.length === 0) {
      const errorGame = new CustomError(
        404,
        "There isn't games in database",
        "Games not found"
      );
      next(errorGame);
      return;
    }
  } catch (error) {
    const mongooseError = new CustomError(
      404,
      error.message,
      "Error getting list of games"
    );
    next(mongooseError);
    return;
  }

  res.status(200).json({ games });
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idGame } = req.params;

  try {
    await Game.findById({ _id: idGame });
    await Game.deleteOne({ _id: idGame });

    res.status(200).json({ message: "Game has been deleted" });
  } catch (error) {
    const customError = new CustomError(
      404,
      error.message,
      "Error deleting game"
    );
    next(customError);
  }
};

export const createGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const newGame = req.body;
  newGame.owner = req.payload.id;
  const { file } = req;

  const newPictureName = `${Date.now()}-${file.originalname}`;
  await fs.rename(
    path.join("uploads", file.filename),
    path.join("uploads", newPictureName)
  );
  newGame.image = newPictureName;

  try {
    const newGameCreated = await Game.create(newGame);

    const user = await User.findById(newGameCreated.owner);
    user.games.push(newGameCreated.id);
    user.save();

    res.status(201).json({ game: newGameCreated });
  } catch (error) {
    const customError = new CustomError(
      400,
      error.message,
      "Error creating new game"
    );
    next(customError);
  }
};
