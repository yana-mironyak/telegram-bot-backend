import { Manuals } from "../../models/Manuals.js";

export const getAllManuals = async () => {
  try {
    const manuals = await Manuals.find();

    return manuals;
  } catch (error) {
    console.error("Error getting manuals data:", error);
    return [];
  }
};

export const getById = async (id) => {
  try {
    const manualById = await Manuals.findById(id);

    return manualById;
  } catch (error) {
    console.error("Error getting manuals data:", error);
    return [];
  }
};
