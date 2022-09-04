import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import CustomError from "../../../utils/CustomError/CustomError";

const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
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

export default getAllGames;
