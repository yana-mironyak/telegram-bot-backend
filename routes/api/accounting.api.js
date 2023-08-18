import { Accounting } from "../../models/Accounting.js";

const getAllAccounting = async () => {
  try {
    const accounting = await Accounting.find();

    return accounting;
  } catch (error) {
    console.error("Error getting accounting data:", error);
    return [];
  }
};

export default getAllAccounting;
