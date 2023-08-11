import { Legal } from "../../models/Legal.js";

const getAllLegal = async () => {
  try {
    const legal = await Legal.find();

    return legal;
  } catch (error) {
    console.error("Error getting legal data:", error);
    return [];
  }
};

export default getAllLegal;
