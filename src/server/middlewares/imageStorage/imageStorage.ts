import { NextFunction, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomRequest from "../../../types/customRequest";
import CustomError from "../../../utils/CustomError/CustomError";
import supabase from "../../../utils/supabaseClient/supabaseClient";

const imageStorage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { file } = req;
  const storage = supabase.storage.from("lohealthy-games");

  const newPictureName = `${Date.now()}-${file.originalname}`;
  await fs.rename(
    path.join("uploads", file.filename),
    path.join("uploads", newPictureName)
  );

  const readFile = await fs.readFile(path.join("uploads", newPictureName));

  const resultUpload = await storage.upload(newPictureName, readFile);

  if (resultUpload.error) {
    const supabaseError = new CustomError(
      400,
      resultUpload.error.message,
      "Error uploading image"
    );
    next(supabaseError);
    return;
  }

  const imageUrl = storage.getPublicUrl(newPictureName);

  req.body.image = newPictureName;
  req.body.backupImage = imageUrl.publicURL;

  next();
};

export default imageStorage;
