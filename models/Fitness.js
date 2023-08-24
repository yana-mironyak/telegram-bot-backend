import { Schema, model } from "mongoose";

const fitnessSchema = new Schema({
  recipients: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export const Fitness = model("fitness", fitnessSchema);
