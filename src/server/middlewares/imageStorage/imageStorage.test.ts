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
  filename: "zeldarandom2",
  originalname: "zeldarandom2.jpg",
} as Partial<Express.Multer.File>;

const req = {
  body: bodyRequest,
  file: fileRequest,
} as Partial<CustomRequest>;
const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

beforeEach(async () => {
  await fs.writeFile("uploads/zeldarandom2", "zelda");
});

afterAll(async () => {
  await fs.unlink("uploads/1000-zeldarandom2");
  jest.clearAllMocks();
});

describe("Given the imageStorage middleware", () => {
  describe("When it's called with correct request with image game", () => {
    describe("And image is uploaded to supabase", () => {
      test("Then next then should be called", async () => {
        jest.spyOn(Date, "now").mockReturnValueOnce(1000);

        await imageStorage(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith();
      });
    });
  });
});
