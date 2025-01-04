import { Router } from "express";
import express from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  loginWithGoogleOAuthSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "../validation/auth.js";
import {
  getGoogleOAuthUrlController,
  loginWithGoogleController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from "../controllers/auth.js";
import { loginUserController } from "../controllers/auth.js";
import { logoutUserController } from "../controllers/auth.js";

import { refreshUserSessionController } from "../controllers/auth.js";

import {
  loginUserSchema,
  requestResetEmailSchema,
} from "../validation/auth.js";
import { validateBody } from "../middlewares/validateBody.js";

const jsonParser = express.json();
const router = Router();

router.post(
  "/register",
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

router.post(
  "/login",
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

router.post("/logout", ctrlWrapper(logoutUserController));

router.post(
  "/send-reset-email",
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);

router.post(
  "/reset-pwd",
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

router.get("/get-oauth-url", ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  "/confirm-oauth",
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController)
);

export default router;
