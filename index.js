import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import connectDB from "./config/database.js";
import getAllFitness from "./routes/api/fitness.api.js";
import getAllLegal from "./routes/api/legal.api.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    keyboard: [[{ text: "Бухгалтерія" }, { text: "ЮД" }, { text: "Фітнес" }]],
    resize_keyboard: true,
  }),
};

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
      const accountingData = await getAllFitness();

      const accountingButtons = accountingData.map((item) => ({
        text: item.title,
        callback_data: item.body,
      }));

      const accountingKeyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: [accountingButtons],
        }),
      };
      return bot.sendMessage(chatId, "Боже поможи", accountingKeyboard);
    }

    if (text === "ЮД") {
      const legalData = await getAllLegal();
      console.log(legalData);

      const legalButtons = legalData.map((item) => ({
        text: item.title,
        callback_data: item.title,
      }));

      const legalKeyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: [legalButtons],
        }),
      };

      return bot.sendMessage(chatId, "Хтось нарвався?", legalKeyboard);
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
