import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import userRegister from "./userControllers";
import CustomError from "../../utils/CustomError/CustomError";

describe("Given the userController controller", () => {
  describe("When it's called userRegister function", () => {
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
});
