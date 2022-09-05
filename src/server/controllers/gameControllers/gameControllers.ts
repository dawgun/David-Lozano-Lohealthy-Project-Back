import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
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

    res.status(202).json({ message: "Game has been deleted" });
  } catch (error) {
    const customError = new CustomError(
      404,
      error.message,
      "Error deleting game"
    );
    next(customError);
  }
};
