import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, ONE_MOUNTH } from "../constants/index.js";
import { SessionCollection } from "../db/models/session.js";

export const registerUser = async (payload) => {
  const registredUser = await UsersCollection.findOne({ email: payload.email });
  if (registredUser) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) throw createHttpError(404, "User not found");

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, "Unauthorized");

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.findOneAndDelete({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MOUNTH),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenValid =
    new Date() < new Date(session.refreshTokenValidUntil);

  if (!isSessionTokenValid) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();

  await SessionCollection.findOneAndDelete({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};