import { Request, Response } from "express";
import CustomError from "../../../utils/CustomError/CustomError";
import { endpointError, generalError } from "./errors";

describe("Given the middleware errors", () => {
  describe("Give the generalErrors middleware", () => {
    const req: Partial<Request> = {};
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    describe("Then it receives a response with a correct custom error", () => {
      const error = new CustomError(409, "Private Message", "Public Message");

      test("Then call the response method status with 409", () => {
        generalError(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(error.statusCode);
      });

      test("Then call the response method json with a public message", () => {
        generalError(error, req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
          error: error.publicMessage,
        });
      });
    });

    describe("Then it receives a response with a incorrect custom error", () => {
      const error = new CustomError(null, "Private Message", null);

      test("Then call the response method status with 409", () => {
        const expectedStatus = 500;

        generalError(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then call the response method json with a public message", () => {
        const expectedPublicMessage = "Everything has peted";

        generalError(error, req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
          error: expectedPublicMessage,
        });
      });
    });
  });
  describe("Given the endpointError middleware", () => {
    describe("When it receives a response", () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      test("Then it should call the response method status with 404", () => {
        const status = 404;

        endpointError(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(status);
      });

      test("Then it should call the response method json with an endpoint error", () => {
        const error = { error: "Endpoint not found" };

        endpointError(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(error);
      });
    });
  });
});
