import { NextFunction, Request, Response } from "express";
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
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { idGame } = req.params;
  const userId = req.payload.id;

  try {
    await Game.findByIdAndDelete({ _id: idGame });
    const user = await User.findById(userId);
    const newGameList = user.games.filter(
      (userGameId) => `${userGameId}` !== idGame
    );
    user.games = newGameList;
    user.save();
  } catch (error) {
    const customError = new CustomError(
      404,
      error.message,
      "Error deleting game"
    );
    next(customError);
    return;
  }

  res.status(200).json({ message: "Game has been deleted" });
};

export const createGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const newGame = req.body;
  newGame.owner = req.payload.id;

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
