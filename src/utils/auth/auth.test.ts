import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomJwtPayload from "../../types/payload";
import { createToken, hashCompare, hashCreator, verifyToken } from "./auth";

describe("Given the auth functions util", () => {
  describe("When it's called the hashCreator function", () => {
    describe("And it's called with patatasfritas", () => {
      test("Then it should return 'patatasfritashasheadas'", async () => {
        bcrypt.hash = jest.fn().mockResolvedValue("patatasfritashasheadas");
        const expectedTextHashed = "patatasfritashasheadas";

        const textHashed = await hashCreator("patatasfritas");

        expect(textHashed).toBe(expectedTextHashed);
      });
    });
  });

  describe("When it's called the hashCompare function", () => {
    const password = "123456";
    describe("And it's called with '123456' and '1bv51i5v1i4v'", () => {
      test("Then it should return 'true'", async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const hashedDBPassword = "1bv51i5v1i4v";
        const expectedComparation = true;

        const isSamePassword = await hashCompare(password, hashedDBPassword);

        expect(isSamePassword).toBe(expectedComparation);
      });
    });

    describe("And it's called with '123456' and '3gady8gaa89'", () => {
      test("Then it should return 'true'", async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        const hashedDBPassword = "3gady8gaa89";
        const expectedComparation = false;

        const isSamePassword = await hashCompare(password, hashedDBPassword);

        expect(isSamePassword).toBe(expectedComparation);
      });
    });
  });

  describe("When it's called the createToken function", () => {
    describe("And it's called with payload with userName", () => {
      test("Then it should return 'true'", async () => {
        const user = { userName: "Lorena", id: "1", image: "" };
        const mockedToken = "3p985qwrywn98pvwwqtmw";
        jwt.sign = jest.fn().mockReturnValue(mockedToken);

        const tokenCreated = createToken(user);

        expect(tokenCreated).toBe(mockedToken);
      });
    });
  });

  describe("When it's called the verifyToken function", () => {
    const token = "bh89adg8a9dg8a";
    describe("And it's called with a correct token", () => {
      test("Then should return a custom payload", () => {
        const payloadReturned: CustomJwtPayload = {
          id: "1",
          image: "marius.jpg",
          userName: "Marius",
        };
        jwt.verify = jest.fn().mockReturnValue(payloadReturned);

        const user = verifyToken(token);

        expect(user).toStrictEqual(payloadReturned);
      });
    });

    describe("And it's called with a incorrect token", () => {
      test("Then should return 'error'", () => {
        const payloadReturned = "error";
        jwt.verify = jest.fn().mockReturnValue(payloadReturned);

        const userError = verifyToken(token);

        expect(userError).toStrictEqual(payloadReturned);
      });
    });
  });
});
