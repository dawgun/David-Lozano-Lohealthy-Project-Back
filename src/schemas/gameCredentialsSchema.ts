import { Joi } from "express-validation";

const createGameValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    players: Joi.string().required(),
    genre: Joi.string().required(),
    release: Joi.date(),
    synopsis: Joi.string().required(),
  }),
};

export default createGameValidation;
