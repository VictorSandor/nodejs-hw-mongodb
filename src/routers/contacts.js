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

const router = Router();

router.use(authenticate);

router.use(authorization);

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

router.put(
  "/:contactId",
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(upsertContactController)
);

export default router;
