import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import { reset } from "nodemon";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token);

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Бухгалтерія", callback_data: "Помилка оформлення" },
        { text: "ЮД", callback_data: "Гарантійний лист" },
        { text: "Фітнес", callback_data: "Відміна заняття" },
      ],
    ],
  }),
};

const start = () => {
  bot.startPolling({ restart: true });
  bot.setMyCommands([
    { command: "/start", description: "Let`s go" },
    { command: "/info", description: "Categories" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      return bot.sendMessage(chatId, "Шо треба?");
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, "Обери категорію", options);
    }

    return bot.sendMessage(chatId, "Якась хуйня");
  });

  // bot.on("callback_query", (msg) => {
  //   const data = msg.data;
  //   const chatId = msg.message.chat.id;

  //   bot.sendMessage(chatId, `${data}`);
  // });
};

start();
