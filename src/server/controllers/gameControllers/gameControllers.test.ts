import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import CustomError from "../../../utils/CustomError/CustomError";
import { deleteGame, getAllGames } from "./gameControllers";

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

  describe("When deleteRobot it's called", () => {
    describe("And it receives a response with correct id", () => {
      const req: Partial<Request> = { params: { idGame: "1" } };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn() as Partial<NextFunction>;

      test("Then it should call the response method status with 202", async () => {
        const status = 202;

        Game.findById = jest.fn();
        Game.deleteOne = jest.fn();

        await deleteGame(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(status);
      });

      test("Then it should call the response method json with message", async () => {
        const messageJson = { message: "Game has been deleted" };

        Game.findById = jest.fn();
        Game.deleteOne = jest.fn();

        await deleteGame(req as Request, res as Response, next as NextFunction);

        expect(res.json).toHaveBeenCalledWith(messageJson);
      });
    });

    describe("And it receives a response with wrong id", () => {
      test("Then it should call next function with an error ", async () => {
        const req: Partial<Request> = { params: { idRobot: "23" } };
        const res: Partial<Response> = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn() as Partial<NextFunction>;

        const customError = new Error();

        Game.findById = jest.fn().mockRejectedValue(new Error());
        Game.deleteOne = jest.fn();

        await deleteGame(req as Request, res as Response, next as NextFunction);

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });
});
