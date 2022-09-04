import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import User from "../../../database/models/User";

let mongoServer: MongoMemoryServer;
const userTest = {
  userName: "Mario",
  email: "marius@isdi.com",
  password: "admin",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();
  User.create(userTest);
  await connectDB(mongoURL);
});

afterAll(async () => {
  User.deleteMany();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the endpoint POST /users/register", () => {
  describe("When it receives a request with an user", () => {
    test("Then it should response with an status 201 a message 'User created'", async () => {
      const message = "User created";
      const { body } = await request(app)
        .post("/user/register")
        .send({
          userName: "David",
          email: "test@isdicoders.com",
          password: "secreto",
        })
        .expect(201);

      expect(body).toHaveProperty("message", message);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should response with status 400 and a message 'Wrong data'", async () => {
      const message = "Wrong data";
      const { body } = await request(app)
        .post("/user/register")
        .send({ username: "Lorena" })
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });

  describe("When it receives a request with an existent userName", () => {
    test("Then it should response with status 400 and a message 'Error creating new user'", async () => {
      const message = "Error creating new user";
      const { body } = await request(app)
        .post("/user/register")
        .send(userTest)
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});
