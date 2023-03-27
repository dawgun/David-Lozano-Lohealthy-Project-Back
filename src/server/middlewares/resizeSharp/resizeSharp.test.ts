import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import CustomError from "../../../utils/CustomError/CustomError";
import resizeSharp from "./resizeSharp";

let mockToFile = jest.fn();

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockToFile,
      }),
    }),
  }),
}));

const fileRequest = {
  filename: "juegorandom",
  originalname: "juegorandom.jpg",
} as Partial<Express.Multer.File>;

const req = {
  file: fileRequest,
} as Partial<Request>;
const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

beforeAll(async () => {
  await fs.writeFile("uploads/juegorandom", "juegorandom");
});

afterAll(async () => {
  await fs.unlink("uploads/juegorandom");
});

describe("Given the resizeSharp", () => {
  describe("When it's instantiated with a correct image", () => {
    test("Then should call next", async () => {
      await resizeSharp(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("When it's instantiated with a incorrect image", () => {
    test("Then should return", async () => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
      const errorSharp = new CustomError(400, "", "Error in sharp");

      mockToFile = jest.fn().mockRejectedValue(new Error());

      await resizeSharp(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(errorSharp);
    });
  });

  describe("When it's called without file in request", () => {
    test("Then function next should to be called", async () => {
      const requestWithoutFile = {} as Partial<Request>;

      await resizeSharp(
        requestWithoutFile as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
