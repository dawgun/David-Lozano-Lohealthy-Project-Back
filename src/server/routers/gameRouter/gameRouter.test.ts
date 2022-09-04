import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import Game from "../../../database/models/Game";

let mongoServer: MongoMemoryServer;
const gameTest = {
  title: "Legend of Zelda",
  synopsis: "Great Game",
  genre: "RPG",
  players: "One Player",
  image: "zelda.jpg",
  release: "2022-09-04T17:14:58.542Z",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();
  Game.create(gameTest);
  await connectDB(mongoURL);
});

afterAll(async () => {
  Game.deleteMany();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the endpoint GET /games", () => {
  describe("When it receives a request", () => {
    test("Then it should response with an status 200 a list of games with length 1", async () => {
      const gamelistLength = 1;
      const { body } = await request(app).get("/games").expect(200);

      expect(body.games).toHaveLength(gamelistLength);
    });
  });
});
