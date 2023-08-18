import { Schema, model } from "mongoose";

const accountingSchema = new Schema({
  recipient: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export const Accounting = model("accounting", accountingSchema);
