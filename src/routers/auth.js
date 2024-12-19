import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import {
  LoginUserSchema,
  RegisterUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  authOAuthGoogleSchema,
} from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerController,
  sendResetEmailController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from "../controllers/auth.js";

const router = Router();

router.post(
  "/register",
  validateBody(RegisterUserSchema),
  ctrlWrapper(registerController)
);

router.post(
  "/login",
  validateBody(LoginUserSchema),
  ctrlWrapper(loginUserController)
);

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

router.post(
  "/send-reset-email",
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetEmailController)
);

router.post(
  "/reset-pwd",
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

router.get("/get-oauth-url", ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  "/confirm-oauth-url",
  validateBody(authOAuthGoogleSchema),
  ctrlWrapper(loginWithGoogleController)
);

export default router;
