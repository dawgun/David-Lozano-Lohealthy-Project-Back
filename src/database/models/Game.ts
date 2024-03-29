import { model, Schema } from "mongoose";
import IGame from "../../types/iGame";

const gameSchema = new Schema<IGame>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  backupImage: {
    type: String,
    required: true,
  },
  players: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  release: {
    type: Date,
    default: new Date(),
  },
  synopsis: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Game = model("Game", gameSchema, "games");

export default Game;
