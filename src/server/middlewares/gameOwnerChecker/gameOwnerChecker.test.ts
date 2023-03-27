import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import Game from "../../../database/models/Game";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";
import gameOwnerChecker from "./gameOwnerChecker";

const gameId = "gameid";
const userId = "123456789012345678901235";

const req = { body: { id: gameId }, payload: { id: userId } } as CustomRequest;
const res = {} as Response;
const next = jest.fn() as NextFunction;

describe("Given the gameOwnerChecker middleware", () => {
  describe("When it's called with wrong user id", () => {
    test("Then should call next function with an error", async () => {
      const wrongUserId = "123456789012345678901231";
      const MongooseIdOwner = new mongoose.Types.ObjectId(wrongUserId);
      const gameFinded = { owner: MongooseIdOwner };
      const customError = new CustomError(
        400,
        "Payload id and id game owner don't match",
        "You do not own"
      );

      Game.findById = jest.fn().mockReturnValue(gameFinded);

      await gameOwnerChecker(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it's called with correct user id", () => {
    test("Then should call next function with void", async () => {
      const correctUserId = userId;
      const MongooseIdOwner = new mongoose.Types.ObjectId(correctUserId);
      const gameFinded = { owner: MongooseIdOwner };

      Game.findById = jest.fn().mockReturnValue(gameFinded);

      await gameOwnerChecker(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith();
    });
  });
});
