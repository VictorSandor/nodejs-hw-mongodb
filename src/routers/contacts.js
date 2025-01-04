import { Router } from "express";
import express from "express";
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from "../controllers/contacts.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authorization } from "../middlewares/authorization.js";

import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const jsonParser = express.json();
const router = Router();

router.use(authenticate);
router.get("/", authenticate, ctrlWrapper(getContactsController));
router.use(authorization);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlWrapper(getContactByIdController)
);

router.post(
  "/",
  upload.single("photo"),
  authenticate,
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactController)
);

router.patch(
  "/:contactId",
  upload.single("photo"),
  authenticate,
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

export default router;
