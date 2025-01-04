import createHttpError from "http-errors";
import {
  deleteContact,
  getAllContcats,
  getContactById,
  patchContact,
  postContact,
} from "../services/contacts.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContcats({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).send({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.send({
    status: 200,
    message: `Successfully found contact with id: ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    const result = await uploadToCloudinary(req.file.path);
    photoUrl = result;
  }

  const newContact = await postContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  if (!newContact) throw createHttpError(404, "Filed to create contact");

  res.status(201).send({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    const result = await uploadToCloudinary(req.file.path);
    photoUrl = result;
  }

  const updateContact = await patchContact(contactId, req.user._id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!updateContact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).send({
    status: 200,
    message: "Successfully patched a contact!",
    data: updateContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const removeContact = await deleteContact(contactId, req.user._id);

  if (!removeContact) {
    throw createHttpError(404, "Contact not found");
  }

  res.sendStatus(204);
};
