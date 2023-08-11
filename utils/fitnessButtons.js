export const generateFitnessButtons = async () => {
  try {
    const fitnessData = await getAllFitness();

    const fitnessButtons = fitnessData.map((item) => ({
      text: item.title,
      callback_data: item.body,
    }));

    const fitnessKeyboard = {
      reply_markup: JSON.stringify({
        inline_keyboard: fitnessButtons,
      }),
    };

    return fitnessKeyboard;
  } catch (error) {
    console.error("Error getting fitness data:", error);
    return null;
  }
};
