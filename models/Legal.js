import { Schema, model } from "mongoose";

const legalSchema = new Schema({
  recipient: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export const Legal = model("legal", legalSchema);
