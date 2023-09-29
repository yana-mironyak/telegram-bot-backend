import { Schema, model } from "mongoose";

const manualsSchema = new Schema({
  recipients: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true },
});

export const Manuals = model("manuals", manualsSchema);
