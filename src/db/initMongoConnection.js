import mongoose from "mongoose";

import { env } from "../utils/env.js";

export async function initMongoConnection() {
  try {
    const user = env("MONGODB_USER");
    const pwd = env("MONGODB_PASSWORD");
    const url = env("MONGODB_URL");
    const db = env("MONGODB_DB");
    const cluster = env("MONGODB_CLUSTER_NAME");

    await mongoose.connect(
      `mongodb+srv://dd:<db_password>@cluster0.afm9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Mongo connection successfully established!");
  } catch (e) {
    console.log("Error while setting up mongo connection", e);
    throw e;
  }
}
