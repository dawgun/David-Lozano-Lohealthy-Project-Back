import { NextFunction, Response } from "express";
import fs from "fs/promises";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";
import imageStorage from "./imageStorage";

interface IMockUploadError {
  error: null | CustomError;
}

const mockUploadError: IMockUploadError = { error: null };

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue(mockUploadError),
        getPublicUrl: () => ({
          publicURL: "Public Url",
        }),
      }),
    },
  }),
}));

const bodyRequest = {
  title: "ZeldaRandom2",
  image: "zelda.jpg",
  players: "Two players",
  genre: "RPG",
  synopsis: "En un lugar muy muy lejano",
};

const fileRequest = {
  filename: "_horizontal_zeldarandom2.webp",
  originalname: "_vertical_zeldarandom2.webp",
} as Partial<Express.Multer.File>;

const req = {
  body: bodyRequest,
  file: fileRequest,
} as Partial<CustomRequest>;
const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

beforeEach(async () => {
  await fs.writeFile(
    "uploads/_horizontal_zeldarandom2.webp",
    "zeldahorizontal"
  );
  await fs.writeFile("uploads/_vertical_zeldarandom2.webp", "zeldavertical");
});

afterAll(async () => {
  await fs.unlink("uploads/1000-_horizontal_zeldarandom2.webp");
  await fs.unlink("uploads/1000-_vertical_zeldarandom2.webp");
  jest.clearAllMocks();
});

describe("Given the imageStorage middleware", () => {
  describe("When it's called with correct request with image game", () => {
    describe("And image is uploaded to supabase", () => {
      test("Then next then should be called", async () => {
        jest.spyOn(Date, "now").mockReturnValue(1000);

        await imageStorage(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith();
      });
    });
  });

  describe("When it's called without file in request", () => {
    test("Then function next should to be called", async () => {
      const requestWithoutFile = {} as Partial<CustomRequest>;

      await imageStorage(
        requestWithoutFile as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
