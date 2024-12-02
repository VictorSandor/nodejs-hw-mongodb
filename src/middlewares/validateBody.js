import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, _res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    console.log(err, "err in validate body", req.body, "req.body");
    const error = createHttpError(400, "Bad request", { errors: err.details });
    next(error);
  }
};
