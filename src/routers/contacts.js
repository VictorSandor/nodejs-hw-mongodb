import { Router } from "express";
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  upsertContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactsSchema,
  updateContactSchema,
} from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

import { authenticate } from "../middlewares/authenticate.js";

import { authorization } from "../middlewares/authorization.js";

import { upload } from "../middlewares/multer.js";

const router = Router();

router.use(authenticate);

router.use(authorization);

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  upload.single("photo"),
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  "/:contactId",
  upload.single("photo"),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

router.put(
  "/:contactId",
  upload.single("photo"),
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(upsertContactController)
);

export default router;
