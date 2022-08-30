import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default:
      "https://www.seekpng.com/png/full/245-2454602_tanni-chand-default-user-image-png.png",
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", UserSchema, "users");

export default User;
