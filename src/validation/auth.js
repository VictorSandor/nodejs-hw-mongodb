import Joi from "joi";

export const RegisterUserSchema = Joi.object({
  name: Joi.string().min(3).max(22).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const LoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
