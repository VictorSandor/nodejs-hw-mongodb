import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, _res, next) => {
  try {
    await schema.validateAsync(body, { abortEarly: false });
    const userId = req.user?._id.toString();
    const body = userId ? { userId, ...req.body } : req.body;
    next();
  } catch (err) {
    console.log(err, "err in validate body", req.body, "req.body");
    const error = createHttpError(400, "Bad request", { errors: err.details });
    next(error);
  }
};
