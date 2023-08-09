import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import connectDB from "./config/database.js";
import getAllFitness from "./routes/api/fitness.api.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    keyboard: [[{ text: "Бухгалтерія" }, { text: "ЮД" }, { text: "Фітнес" }]],
    resize_keyboard: true,
  }),
};

const buh = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Повернення на віртуальний рахунок",
          callback_data: "Повернення на віртуальний рахунок",
        },
      ],
      [{ text: "Повернення авансу", callback_data: "Повернення авансу" }],
      [{ text: "Подарункова картка", callback_data: "Подарункова картка" }],
    ],
  }),
};

const loyer = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Гарантійний лист",
          callback_data: "Гарантійний лист",
        },
      ],
      [
        {
          text: "Порушення клубних правил",
          callback_data: "Порушення клубних правил",
        },
      ],
      [{ text: "Юридична відповідь", callback_data: "Юридична відповідь" }],
    ],
  }),
};

// const generateFitnessButtons = async () => {
//   try {
//     const fitnessData = await getAllFitness();

//     const fitnessButtons = fitnessData.map((item) => ({
//       text: item.title,
//       callback_data: item.body,
//     }));

//     const fitnessKeyboard = {
//       reply_markup: JSON.stringify({
//         inline_keyboard: fitnessButtons,
//       }),
//     };

//     return fitnessKeyboard;
//   } catch (error) {
//     console.error("Error getting fitness data:", error);
//     return null;
//   }
// };

const start = async () => {
  connectDB();

  bot.setMyCommands([
    { command: "/start", description: "Let`s go" },
    { command: "/categories", description: "Categories" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log(text);

    if (text === "/start") {
      return bot.sendMessage(chatId, "Шо вже трапилось?");
    }

    if (text === "/categories") {
      return bot.sendMessage(chatId, "Тицяй категорію", options);
    }

    if (text === "Бухгалтерія") {
      return bot.sendMessage(chatId, "Боже поможи", buh);
    }

    if (text === "ЮД") {
      return bot.sendMessage(chatId, "Хтось нарвався?", loyer);
    }

    if (text === "Фітнес") {
      const fitnessData = await getAllFitness();

      const fitnessButtons = fitnessData.map((item) => ({
        text: item.title,
        callback_data: item.body,
      }));

      const fitnessKeyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: [fitnessButtons],
        }),
      };

      return bot.sendMessage(chatId, "Ахрана-атмєна", fitnessKeyboard);
    }

    return bot.sendMessage(chatId, "Якась хуйня");
  });

  bot.on("callback_query", (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    console.log(data);

    const htmlMessage = `<b>${data}</b>\n\n<b>Інфо про клієнта</b>\nПІБ:\nКод анкети:`;

    bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
  });
};

start();
