import { Joi } from "express-validation";

const minLength = 5;

export const registerValidation = {
  body: Joi.object({
    userName: Joi.string().min(minLength).required(),
    password: Joi.string().min(minLength).required(),
    repeat_password: Joi.ref("password"),
    email: Joi.string().email().required(),
    image: Joi.string(),
  }),
};

export const loginValidation = {
  body: Joi.object({
    userName: Joi.string().min(minLength).required(),
    password: Joi.string().min(minLength).required(),
  }),
};
