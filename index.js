import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import connectDB from "./config/database.js";
import getAllFitness from "./routes/api/fitness.api.js";
import getAllLegal from "./routes/api/legal.api.js";
import getAllAccounting from "./routes/api/accounting.api.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    keyboard: [[{ text: "Бухгалтерія" }, { text: "ЮД" }, { text: "Фітнес" }]],
    resize_keyboard: true,
  }),
};

let accountingData;
let legalData;
let fitnessData;

const start = async () => {
  connectDB();

  bot.setMyCommands([
    { command: "/start", description: "Let`s go" },
    { command: "/categories", description: "Categories" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      return bot.sendMessage(chatId, "Шо вже трапилось?");
    }

    if (text === "/categories") {
      return bot.sendMessage(chatId, "Тицяй категорію", options);
    }

    if (text === "Бухгалтерія") {
      accountingData = await getAllAccounting();

      const accountingKeyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: accountingData((item) => [
            { text: item.title, callback_data: item.id },
          ]),
        }),
      };

      return bot.sendMessage(chatId, "Боже поможи", accountingKeyboard);
    }

    if (text === "ЮД") {
      legalData = await getAllLegal();

      const legalKeyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: legalData.map((item) => [
            { text: item.title, callback_data: item.id },
          ]),
        }),
      };

      return bot.sendMessage(chatId, "Хтось нарвався?", legalKeyboard);
    }

    if (text === "Фітнес") {
      fitnessData = await getAllFitness();

      const fitnessKeyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: fitnessData.map((item) => [
            { text: item.title, callback_data: item.id },
          ]),
        }),
      };

      return bot.sendMessage(chatId, "Ахрана-атмєна", fitnessKeyboard);
    }

    return bot.sendMessage(chatId, "Якась хуйня");
  });

  bot.on("callback_query", (query) => {
    const textId = query.data;
    const chatId = query.message.chat.id;

    console.log(fitnessData);

    const htmlMessage = `<b>${textId}</b>\n\n<b>Інфо про клієнта</b>\nПІБ:\nКод анкети:`;

    bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
  });
};

start();
