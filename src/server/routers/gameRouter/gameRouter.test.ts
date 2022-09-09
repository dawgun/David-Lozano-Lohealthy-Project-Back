import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import Game from "../../../database/models/Game";
import User from "../../../database/models/User";
import { createToken } from "../../../utils/auth/auth";

let mongoServer: MongoMemoryServer;
const gameTest = {
  title: "Legend of Zelda",
  synopsis: "Great Game",
  genre: "RPG",
  players: "One Player",
  image: "zelda.jpg",
  backupImage: "supabase/zelda.jpg",
  release: "2022-09-04T17:14:58.542Z",
};

const userForCreate = {
  userName: "Lohealthy",
  password: "123456",
  email: "lohealhtygames@gmail.com",
};

let lohealthyToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);

  await Game.create(gameTest);
  const newUser = await User.create(userForCreate);

  const mockPayload = {
    id: newUser.id,
    userName: userForCreate.userName,
    image: "user.jpg",
  };
  lohealthyToken = await createToken(mockPayload);
});

afterAll(async () => {
  User.deleteMany();
  Game.deleteMany();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the gameRouter", () => {
  describe("When use the endpoint GET /games", () => {
    describe("And it receives a request", () => {
      test("Then it should response with an status 200 a list of games with length 1", async () => {
        const gamelistLength = 1;
        const { body } = await request(app).get("/games").expect(200);

        expect(body.games).toHaveLength(gamelistLength);
      });
    });
  });

  describe("When use the endpoint POST /games/create", () => {
    describe("And it receives a correct request with game and token in authorization", () => {
      test("Then it should response with the new game created", async () => {
        const expectedTitleBody = "mario";

        const { body } = await request(app)
          .post("/games/create")
          .set("Authorization", `Bearer ${lohealthyToken}`)
          .type("multipart/formd-ata")
          .field("title", "mario")
          .field("genre", "adventure")
          .field("players", "one player")
          .field("synopsis", "game fabulous")
          .attach("image", Buffer.from("mockImageString", "utf-8"), {
            filename: "game",
          })
          .expect(201);

        expect(body.game).toHaveProperty("title", expectedTitleBody);
      });
    });

    describe("And it receives an uncomplete game", () => {
      test("Then it should response with status 400 and a message 'Wrong data'", async () => {
        const message = "Wrong data";

        const { body } = await request(app)
          .post("/games/create")
          .set("Authorization", `Bearer ${lohealthyToken}`)
          .type("multipart/formd-ata")
          .field("title", "mario")
          .expect(400);

        expect(body).toHaveProperty("error", message);
      });
    });
  });
});
