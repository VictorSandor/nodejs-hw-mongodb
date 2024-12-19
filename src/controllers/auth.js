import { ONE_MOUNTH } from "../constants/index.js";
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetPassword,
  loginOrRegisterWithGoogle,
} from "../services/auth.js";

import createHttpError from "http-errors";
import { generateAuthUrl } from "../utils/googleOAuth2.js";

//register User controller

export const registerController = async (req, res) => {
  const payload = req.body;

  const user = await registerUser(payload);

  res
    .status(201)
    .json({ status: 201, message: "User successfully registred", data: user });
};


export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  if (!req.cookies.sessionId) {
    throw createHttpError(401, "Unauthorized");
  }
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

//** setup session (local function)

const setupSession = (res, session) => {
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });
};


export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: { accessToken: session.accessToken },
  });
};


export const sendResetEmailController = async (req, res) => {
  const result = await requestResetToken(req.body.email);
  console.log(req.body.email, "req.body.email");

  if (result.rejected.length > 0) {
    throw createHttpError(
      500,
      "Failed to send the email, please try again later."
    );
  }

  res.status(200).json({
    status: 200,
    message: "Reset password email was successfully sent!",
    data: {},
  });
};


export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: "Password was successfully reset!",
    status: 200,
    data: {},
  });
};


export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.status(200).json({
    status: 200,
    message: "Successfully get Google OAuth url",
    data: {
      url,
    },
  });
};


export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrRegisterWithGoogle(req.body.code);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: "Successfully login with Google",
    data: {
      accessToken: session.accessToken,
    },
  });
};
