import { Types } from "mongoose";

interface IGame {
  title: string;
  image: string;
  backupImage: string;
  players: string;
  genre: string;
  release: Date;
  synopsis: string;
  owner: Types.ObjectId;
  id: string;
}

export default IGame;
