import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import CustomError from "../../../utils/CustomError/CustomError";
import getAllGames from "./gameControllers";

describe("Given the gameControllers", () => {
  describe("When it's called getAllGames controller", () => {
    const req: Partial<Request> = {};
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: Partial<NextFunction> = jest.fn();
    describe("And database return a list of games", () => {
      test("Then call the response method status with 200", async () => {
        const mockGameList = [{ game: "" }];
        Game.find = jest.fn().mockResolvedValue(mockGameList);

        await getAllGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
      });

      test("Then call the response method json with a list of games", async () => {
        const mockGameList = [{ game: "" }];
        Game.find = jest.fn().mockResolvedValue(mockGameList);

        await getAllGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith({ games: mockGameList });
      });
    });

    describe("And database return a void list of games", () => {
      test("Then call next function with an error", async () => {
        const errorGame = new CustomError(
          404,
          "There isn't games in database",
          "Games not found"
        );

        const mockGameList: void[] = [];
        Game.find = jest.fn().mockResolvedValue(mockGameList);

        await getAllGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(errorGame);
      });
    });

    describe("And when mongoose getting games throw an error", () => {
      test("Then call next function with an error", async () => {
        const errorMongooseGame = new CustomError(
          404,
          "",
          "Error getting list of games"
        );

        Game.find = jest.fn().mockRejectedValue("");

        await getAllGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(errorMongooseGame);
      });
    });
  });
});
