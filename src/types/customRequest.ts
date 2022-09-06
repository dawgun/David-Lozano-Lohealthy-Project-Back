import { Request } from "express";
import CustomJwtPayload from "./payload";

interface CustomRequest extends Request {
  payload: CustomJwtPayload;
}

export default CustomRequest;
