import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import supabase from "../../../utils/supabaseClient/supabaseClient";

const imageStorage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const { filename, originalname } = req.file;
  const storage = supabase.storage.from("lohealthy-games");
  const newHorizontalPicture = `${Date.now()}-${filename}`;
  const newVerticalPicture = `${Date.now()}-${originalname}`;

  await fs.rename(
    path.join("uploads", filename),
    path.join("uploads", newHorizontalPicture)
  );

  await fs.rename(
    path.join("uploads", originalname),
    path.join("uploads", newVerticalPicture)
  );

  const readHorizontalFile = await fs.readFile(
    path.join("uploads", newHorizontalPicture)
  );
  const readVerticalFile = await fs.readFile(
    path.join("uploads", newVerticalPicture)
  );

  await storage.upload(newHorizontalPicture, readHorizontalFile);
  await storage.upload(newVerticalPicture, readVerticalFile);

  const imageHorizontalUrl = storage.getPublicUrl(newHorizontalPicture);
  const imageVerticalUrl = storage.getPublicUrl(newVerticalPicture);

  req.body.image = imageHorizontalUrl.publicURL;
  req.body.backupImage = imageVerticalUrl.publicURL;

  next();
};

export default imageStorage;
