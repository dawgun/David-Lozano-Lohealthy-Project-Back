import { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import User from "../../../database/models/User";
import CustomRequest from "../../../types/customRequest";
import GameRequest from "../../../types/gameRequest";
import IGame from "../../../types/iGame";
import CustomJwtPayload from "../../../types/payload";
import CustomError from "../../../utils/CustomError/CustomError";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  getGamesByUser,
  searchGames,
  updateGame,
} from "./gameControllers";

let res: Partial<Response>;
let next: Partial<NextFunction>;

beforeEach(() => {
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the gameControllers", () => {
  describe("When it's called getAllGames controller", () => {
    const req: Partial<Request> = { query: { page: "0" } };

    describe("And database return a list of games", () => {
      test("Then call the response method status with 200", async () => {
        const mockGameList = [{ game: "" }];
        Game.countDocuments = jest.fn().mockResolvedValue(10);

        Game.find = jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue(mockGameList),
          }),
        });

        await getAllGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(200);
      });

      test("Then call the response method json with a list of games", async () => {
        const mockGameList = [{ game: "" }];
        const expectedResponse = {
          games: {
            games: mockGameList,
            isNextPage: true,
            isPreviousPage: false,
            totalPages: 2,
          },
        };

        Game.countDocuments = jest.fn().mockResolvedValue(10);
        Game.find = jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue(mockGameList),
          }),
        });

        await getAllGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith(expectedResponse);
      });
    });

    describe("And database return a void list of games", () => {
      test("Then call next function with an error", async () => {
        const errorGame = new CustomError(
          404,
          "There isn't games in database",
          "Games not found"
        );
        Game.countDocuments = jest.fn().mockResolvedValue(10);

        const mockGameList: void[] = [];
        Game.find = jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue(mockGameList),
          }),
        });

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

        Game.countDocuments = jest.fn().mockResolvedValue(10);

        Game.find = jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValue("error"),
          }),
        });

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
        const customError = new CustomError(400, "", "Error creating new game");

        Game.create = jest.fn().mockRejectedValue(gameCreated);

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

  describe("When searchGames it's called", () => {
    const req: Partial<Request> = { query: { title: "Banjo" } };

    test("Then should call the method status 200", async () => {
      const statusResponse = 200;

      Game.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(""),
        }),
      });

      await searchGames(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(statusResponse);
    });

    test("Then should call the method json with 'Game'", async () => {
      const gameListSearched = ["Game"];
      const jsonResponse = {
        games: {
          isPreviousPage: false,
          isNextPage: false,
          totalPages: 1,
          games: gameListSearched,
        },
      };

      Game.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(gameListSearched),
        }),
      });

      await searchGames(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith(jsonResponse);
    });

    describe("And mongoose throw an error when search game", () => {
      test("Then should call the function next with an error", async () => {
        const customError = new CustomError(
          400,
          "Mongoose Error",
          "Error searching games"
        );

        Game.find = jest.fn().mockRejectedValueOnce(customError);
        Game.find = jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValueOnce(customError),
          }),
        });

        await searchGames(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });

  describe("When updateGame it's called", () => {
    const req: Partial<GameRequest<Partial<IGame>>> = {
      body: {
        id: "1241412",
      },
    };

    describe("And mongoose return the new game updated", () => {
      test("Then should call the method status with '200'", async () => {
        const statusCode = 200;

        Game.findByIdAndUpdate = jest.fn().mockResolvedValue("");

        await updateGame(
          req as GameRequest<Partial<IGame>>,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(statusCode);
      });

      test("Then should call the method json with game 'Super Mario' updated", async () => {
        const gameUpdated: Partial<IGame> = { title: "Super Mario" };

        Game.findByIdAndUpdate = jest.fn().mockResolvedValue(gameUpdated);

        await updateGame(
          req as GameRequest<Partial<IGame>>,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith({ game: gameUpdated });
      });
    });

    describe("And mongoose throw an error when try update game", () => {
      test("Then should call the function next with an error", async () => {
        const errorMongoose = new CustomError(
          400,
          "Mongoose Error",
          "Error updating game"
        );

        Game.findByIdAndUpdate = jest.fn().mockRejectedValue(errorMongoose);

        await updateGame(
          req as GameRequest<Partial<IGame>>,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(errorMongoose);
      });
    });
  });
});
