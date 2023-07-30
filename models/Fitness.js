const fitnessSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export const Fitness = mongoose.model("Fitness", fitnessSchema);
