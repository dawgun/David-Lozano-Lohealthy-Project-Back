import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import User from "../../../database/models/User";
import CustomRequest from "../../../types/customRequest";
import CustomJwtPayload from "../../../types/payload";
import CustomError from "../../../utils/CustomError/CustomError";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  getGamesByUser,
} from "./gameControllers";

let res: Partial<Response>;
let next: Partial<NextFunction>;

beforeAll(() => {
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("Given the gameControllers", () => {
  describe("When it's called getAllGames controller", () => {
    const req: Partial<Request> = {};

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

  describe("When deleteCreate it's called", () => {
    const payloadRequest: CustomJwtPayload = {
      userName: "Nachus",
      id: "631096a08ada91dad208fb07",
      image: "nachus.jpg",
    };

    describe("And it receives a response with correct id", () => {
      const req: Partial<CustomRequest> = {
        params: { idGame: "1" },
        payload: payloadRequest,
      };

      test("Then it should call the response method status with 200", async () => {
        const status = 200;

        Game.findByIdAndDelete = jest.fn();
        User.findById = jest.fn().mockResolvedValue({
          games: ["1"],
          save: jest.fn(),
        });

        await deleteGame(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(status);
      });

      test("Then it should call the response method json with message", async () => {
        const messageJson = { message: "Game has been deleted" };

        Game.findByIdAndDelete = jest.fn();
        User.findById = jest.fn().mockResolvedValue({
          games: ["1"],
          save: jest.fn(),
        });

        await deleteGame(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith(messageJson);
      });
    });

    describe("And it receives a response with wrong id", () => {
      test("Then it should call next function with an error", async () => {
        const req: Partial<CustomRequest> = {
          params: { idGame: "23" },
          payload: payloadRequest,
        };
        const customError = new Error();

        Game.findByIdAndDelete = jest.fn().mockRejectedValue(new Error());
        User.findById = jest.fn().mockResolvedValue({
          games: [],
          save: jest.fn(),
        });

        await deleteGame(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });

  describe("When createGame it's called", () => {
    const bodyRequest = {
      title: "ZeldaRandom2",
      image: "uploads/2ff48d36e670e4ecc0fda90df16c45d6.jpeg",
      players: "Two players",
      genre: "RPG",
      synopsis: "En un lugar muy muy lejano",
    };

    const payloadRequest: CustomJwtPayload = {
      userName: "Nachus",
      id: "631096a08ada91dad208fb07",
      image: "nachus.jpg",
    };

    const fileRequest = {
      filename: "zeldarandom2",
      originalname: "zeldarandom2.jpg",
    } as Partial<Express.Multer.File>;

    const req = {
      body: bodyRequest,
      payload: payloadRequest,
      file: fileRequest,
    } as Partial<CustomRequest>;

    const idGame = "ZeldaId01";
    const userFinded = "idnachus88";
    const gameCreated = { ...bodyRequest, id: idGame, games: [""] };
    Game.create = jest.fn().mockResolvedValue(gameCreated);
    User.findById = jest.fn().mockResolvedValue({
      id: userFinded,
      games: [],
      save: jest.fn(),
    });

    describe("And it receives a response with a game", () => {
      test("Then call the response method status with 201", async () => {
        const expectedStatus = 201;

        await createGame(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should call the response method json with gameCreated", async () => {
        await createGame(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith({ game: gameCreated });
      });
    });

    describe("And it receives a response with a game existent", () => {
      test("Then it should call next function with an error", async () => {
        Game.create = jest.fn().mockRejectedValue(gameCreated);
        const customError = new CustomError(400, "", "Error creating new game");

        await createGame(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });

  describe("When getGamesByUser it's called", () => {
    const req = { payload: { id: "1" } } as Partial<CustomRequest>;

    describe("And database return a user with list of games", () => {
      test("Then call the response method status with 200", async () => {
        const mockGameList = { games: ["1"] };
        User.findById = jest.fn().mockReturnThis();
        User.populate = jest.fn().mockResolvedValue(mockGameList);

        await getGamesByUser(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
      });

      test("Then call the response method status with 200", async () => {
        const mockGameList = { games: ["1"] };
        User.findById = jest.fn().mockReturnThis();
        User.populate = jest.fn().mockResolvedValue(mockGameList);

        await getGamesByUser(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith({ games: mockGameList.games });
      });
    });

    describe("And database return an error", () => {
      test("Then call the next method with an error", async () => {
        const mockGameList = { games: ["1"] };
        User.findById = jest.fn().mockReturnThis();
        User.populate = jest.fn().mockRejectedValue(mockGameList);
        const errorMongooseGame = new CustomError(
          404,
          "",
          "Error getting games of user"
        );

        await getGamesByUser(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(errorMongooseGame);
      });
    });
  });

  describe("When getGamesById it's called", () => {
    const req = { params: { idGame: "1" } } as Partial<Request>;
    const mockGame = { game: { title: "Commandos" } };

    describe("And database return a user with a game with title 'Commandos'", () => {
      test("Then call the response method status with 200", async () => {
        Game.findById = jest.fn().mockReturnThis();
        Game.populate = jest.fn().mockResolvedValue(mockGame);

        await getGameById(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
      });

      test("Then call the response method status with 200", async () => {
        Game.findById = jest.fn().mockReturnThis();
        Game.populate = jest.fn().mockResolvedValue(mockGame);

        await getGameById(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith({ game: mockGame });
      });
    });

    describe("And database return an error", () => {
      test("Then call the next method with an error", async () => {
        Game.findById = jest.fn().mockReturnThis();
        Game.populate = jest.fn().mockRejectedValue(mockGame);
        const errorMongooseGame = new CustomError(404, "", "Game not found");

        await getGameById(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(errorMongooseGame);
      });
    });
  });
});
