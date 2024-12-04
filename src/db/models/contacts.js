import { model, Schema } from "mongoose";
import { contactsTypeList } from "../../constants/index.js";
import { handleSaveError, setupUpdateValidator } from "./hooks.js";

const ContactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: true,
      enum: contactsTypeList,
      default: "personal",
    },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true, versionKey: false }
);

ContactsSchema.post("save", handleSaveError);
ContactsSchema.pre("findOneAndUpdate", setupUpdateValidator);
ContactsSchema.post("findOneAndUpdate", handleSaveError);

export const ContactsCollection = model("contacts", ContactsSchema);
