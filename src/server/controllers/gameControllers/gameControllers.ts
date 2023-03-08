import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import User from "../../../database/models/User";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";
import gamePagination from "../../../utils/gamePagination/gamePagination";

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageOptions = {
      page: Number(req.query.page) || 0,
      limit: 8,
    };

    const countGames: number = await Game.countDocuments();

    const checkPages = await gamePagination(pageOptions, countGames);

    const games = await Game.find()
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit);

    if (games.length === 0) {
      const errorGame = new CustomError(
        404,
        "There isn't games in database",
        "Games not found"
      );
      next(errorGame);
      return;
    }
    res.status(200).json({ games: { ...checkPages, games } });
  } catch (error) {
    const mongooseError = new CustomError(
      404,
      error.message,
      "Error getting list of games"
    );
    next(mongooseError);
  }
};

export const getGamesByUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.payload.id;

  try {
    const userGameList = await User.findById(userId).populate("games");

    res.status(200).json({ games: userGameList.games });
    return;
  } catch (error) {
    const customError = new CustomError(
      404,
      error.message,
      "Error getting games of user"
    );
    next(customError);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idGame } = req.params;

  try {
    const game = await Game.findById(idGame).populate("owner", {
      userName: true,
    });

    res.status(200).json({ game });
    return;
  } catch (error) {
    const customError = new CustomError(404, error.message, "Game not found");
    next(customError);
  }
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

export const searchGames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.query;
    const findQuery = { title: { $regex: title.toString() } };
    const pageOptions = {
      page: Number(req.query.page) || 0,
      limit: 8,
    };

    const games = await Game.find(findQuery)
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit);

    const checkPages = await gamePagination(pageOptions, games.length);

    res.status(200).json({ games: { ...checkPages, games } });
  } catch (error) {
    const customError = new CustomError(
      400,
      error.message,
      "Error searching games"
    );
    next(customError);
  }
};
