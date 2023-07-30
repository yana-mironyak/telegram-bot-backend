import { Fitness } from "../../models/Fitness";

const getAllFitness = async () => {
  try {
    const fitness = await Fitness.find();
    return fitness;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

export default getAllFitness;
