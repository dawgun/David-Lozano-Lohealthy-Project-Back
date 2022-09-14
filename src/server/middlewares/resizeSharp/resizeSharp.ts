import { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../utils/CustomError/CustomError";

const resizeSharp = async (req: Request, res: Response, next: NextFunction) => {
  const { filename, originalname } = req.file;

  try {
    await sharp(path.join("uploads", filename))
      .resize(320, 180, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join("uploads", `_horizontal_${originalname}.webp`));

    await sharp(path.join("uploads", filename))
      .resize(90, 160, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join("uploads", `_vertical_${originalname}.webp`));

    req.file.filename = `_horizontal_${originalname}.webp`;
    req.file.originalname = `_vertical_${originalname}.webp`;

    next();
  } catch (error) {
    const newError = new CustomError(400, error.message, "Error in sharp");
    next(newError);
  }
};

export default resizeSharp;
