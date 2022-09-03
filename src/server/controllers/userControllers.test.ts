import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../database/models/User";
import { userLogin, userRegister } from "./userControllers";
import CustomError from "../../utils/CustomError/CustomError";
import { DatabaseUser, LoginUser } from "../../types/user";

describe("Given the userController controller", () => {
  describe("When it's called userRegister controller", () => {
    const mockUser = { userName: "", password: "", email: "" };
    const req: Partial<Request> = {
      body: mockUser,
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: Partial<NextFunction> = jest.fn();

    describe("And it's received a correct Response", () => {
      test("Then call the response method status with 201", async () => {
        const status = 201;
        User.create = jest.fn().mockResolvedValue(mockUser);

        await userRegister(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(status);
      });

      test("Then call the response method json with an social user", async () => {
        const passwordHashed = "12345";
        const expectedResponse = { message: "User created" };

        User.create = jest.fn().mockResolvedValue(mockUser);
        bcrypt.hash = jest.fn().mockResolvedValue(passwordHashed);

        await userRegister(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith(expectedResponse);
      });
    });

    describe("And it's received a incorrect Response", () => {
      test("Then call next function with an error", async () => {
        const error = new CustomError(400, "", "");
        User.create = jest.fn().mockRejectedValue(new Error());

        await userRegister(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("When it's called userLogin controller", () => {
    const mockUserLogin: LoginUser = {
      userName: "Nachus",
      password: "123456",
    };
    const mockUserFound: DatabaseUser = {
      userName: "",
      password: "",
      email: "",
      id: "",
      image: "",
    };
    const req: Partial<Request> = {
      body: mockUserLogin,
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: Partial<NextFunction> = jest.fn();

    describe("And it's receive a request with an user", () => {
      test("Then call the response method status with 200", async () => {
        const bcryptResolve = true;
        const jwtReturn = "SuperToken";

        User.findOne = jest.fn().mockResolvedValue(mockUserFound);
        bcrypt.compare = jest.fn().mockResolvedValue(bcryptResolve);
        jwt.sign = jest.fn().mockReturnValue(jwtReturn);

        await userLogin(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(200);
      });

      test("Then call the response method json with 'Supertoken'", async () => {
        const bcryptResolve = true;
        const jwtReturn = "SuperToken";

        User.findOne = jest.fn().mockResolvedValue(mockUserFound);
        bcrypt.compare = jest.fn().mockResolvedValue(bcryptResolve);
        jwt.sign = jest.fn().mockReturnValue(jwtReturn);

        await userLogin(req as Request, res as Response, next as NextFunction);

        expect(res.json).toHaveBeenCalledWith({ token: jwtReturn });
      });

      describe("And it's receieve a correct user", () => {
        describe("But user is not found", () => {
          test("Then call the response method next with an error", async () => {
            const userNotFound: null = null;
            const userError = new CustomError(
              403,
              "User not found",
              "User or password not valid"
            );

            User.findOne = jest.fn().mockResolvedValue(userNotFound);
            await userLogin(
              req as Request,
              res as Response,
              next as NextFunction
            );

            expect(next).toHaveBeenCalledWith(userError);
          });
        });

        describe("But error is throwed when finging user", () => {
          test("Then call the response method next with an error", async () => {
            const mongooseReject = new Error();
            const userError = new CustomError(403, "", "");

            User.findOne = jest.fn().mockRejectedValue(mongooseReject);
            await userLogin(
              req as Request,
              res as Response,
              next as NextFunction
            );

            expect(next).toHaveBeenCalledWith(userError);
          });
        });

        describe("But password comparer returns false", () => {
          test("Then call the response method next with an error", async () => {
            const userError = new CustomError(403, "", "");
            const bcryptResolve = false;

            User.findOne = jest.fn().mockResolvedValue(mockUserFound);
            bcrypt.compare = jest.fn().mockResolvedValue(bcryptResolve);
            await userLogin(
              req as Request,
              res as Response,
              next as NextFunction
            );

            expect(next).toHaveBeenCalledWith(userError);
          });
        });

        describe("But password comparer throw an error", () => {
          test("Then call the response method next with an error", async () => {
            const userError = new CustomError(403, "", "");
            const bcryptError = new Error();

            User.findOne = jest.fn().mockResolvedValue(mockUserFound);
            bcrypt.compare = jest.fn().mockRejectedValue(bcryptError);
            await userLogin(
              req as Request,
              res as Response,
              next as NextFunction
            );

            expect(next).toHaveBeenCalledWith(userError);
          });
        });
      });
    });
  });
});
