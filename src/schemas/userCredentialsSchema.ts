import { Joi } from "express-validation";

const registerValidation = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    repeat_password: Joi.ref("password"),
    email: Joi.string().email().required(),
    image: Joi.string(),
  }),
};

export default registerValidation;
