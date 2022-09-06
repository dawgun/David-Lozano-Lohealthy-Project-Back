import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";
import userAuthentification from "./userAuthentification";

const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;
jwt.verify = jest.fn().mockReturnValue({
  id: "1",
  image: "david.jpg",
  userName: "David",
});

describe("Given the userAuthentification middleware", () => {
  const error = new CustomError(400, "Bad Login", "User sends bad login");

  describe("When it receives a request", () => {
    describe("And request have a correct authentification", () => {
      test("Then it should call the next function and userToken inside request as payload", () => {
        const req = {
          get: jest.fn().mockReturnValue("Bearer #"),
        } as Partial<CustomRequest>;
        const propertyRequest = "payload";

        userAuthentification(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith();
        expect(req).toHaveProperty(propertyRequest);
      });
    });

    describe("And when haven't 'Authorization' in the header", () => {
      test("Then it should call the next function with an error", () => {
        const req = {
          get: jest.fn().mockReturnValue(""),
        } as Partial<CustomRequest>;

        userAuthentification(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("And when the Authorization header at request start with 'NoBearer'", () => {
      test("Then it should call the next function with an error", () => {
        const req = {
          get: jest.fn().mockReturnValue("NoBearer"),
        } as Partial<CustomRequest>;

        userAuthentification(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("And when the verifyToken function return 'tokenDehashed'", () => {
      test("Then it should call the next function with an error", () => {
        const req = {
          get: jest.fn().mockReturnValue("Bearer #"),
        } as Partial<CustomRequest>;
        jwt.verify = jest.fn().mockReturnValue("tokenDehashed");

        userAuthentification(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});
