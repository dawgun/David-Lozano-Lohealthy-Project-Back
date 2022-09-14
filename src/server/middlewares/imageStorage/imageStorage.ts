import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import supabase from "../../../utils/supabaseClient/supabaseClient";

const imageStorage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { filename } = req.file;
  const storage = supabase.storage.from("lohealthy-games");

  const newPictureName = `${Date.now()}-${filename}`;
  await fs.rename(
    path.join("uploads", filename),
    path.join("uploads", newPictureName)
  );

  const readFile = await fs.readFile(path.join("uploads", newPictureName));

  await storage.upload(newPictureName, readFile);

  const imageUrl = storage.getPublicUrl(newPictureName);

  req.body.image = newPictureName;
  req.body.backupImage = imageUrl.publicURL;

  next();
};

export default imageStorage;
