import { NextFunction, Response } from "express";
import Game from "../../../database/models/Game";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";

const gameOwnerChecker = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { idGame } = req.params;
  const gameRequestId = req.body.id ?? idGame;
  const ownerId = req.payload.id;

  const game = await Game.findById(gameRequestId);

  if (game.owner.toString() === ownerId) {
    next();
    return;
  }

  const customError = new CustomError(
    400,
    "Payload id and id game owner don't match",
    "You do not own"
  );

  next(customError);
};

export default gameOwnerChecker;
