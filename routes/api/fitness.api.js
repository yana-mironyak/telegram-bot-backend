import { Fitness } from "../../models/Fitness.js";

const getAllFitness = async () => {
  try {
    const fitness = await Fitness.find();

    return fitness;
  } catch (error) {
    console.error("Error getting fitness data:", error);
    return [];
  }
};

export default getAllFitness;
