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

const dataHandlers = {
  Бухгалтерія: {
    getAllData: getAllAccounting,
    successMessage: "Боже поможи",
  },
  ЮД: {
    getAllData: getAllLegal,
    successMessage: "Хтось нарвався?",
  },
  Фітнес: {
    getAllData: getAllFitness,
    successMessage: "Ахрана-атмєна",
  },
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

    if (text === "/start") {
      return bot.sendMessage(chatId, "Шо вже трапилось?");
    }

    if (text === "/categories") {
      return bot.sendMessage(chatId, "Тицяй категорію", options);
    }

    if (dataHandlers[text]) {
      const { getAllData, successMessage } = dataHandlers[text];
      const data = await getAllData();

      const keyboard = {
        reply_markup: JSON.stringify({
          inline_keyboard: data.map((item) => [
            { text: item.title, callback_data: item.id },
          ]),
        }),
      };

      return bot.sendMessage(chatId, successMessage, keyboard);
    }

    return bot.sendMessage(chatId, "Якась хуйня");
  });

  bot.on("callback_query", async (query) => {
    const textId = query.data;
    const chatId = query.message.chat.id;

    const findManual = async (textId) => {
      for (const categoryData of Object.values(dataHandlers)) {
        const selectedManual = await categoryData
          .getAllData()
          .find((item) => item.id == textId);

        if (selectedManual) {
          return selectedManual;
        }
      }
      return null;
    };

    const selectedManual = await findManual(textId);

    if (selectedManual) {
      const { recipients, title, body } = selectedManual;

      const htmlMessage = `
      Адресати: ${recipients}\n\nТема листа: ${title}, Клуб, ПІБ\n
      <b>${body}</b>\n
      <b>Інфо про клієнта</b>
      ПІБ:
      Код анкети:\n
      `;

      bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(chatId, "Хм, щось пішло не так");
    }
  });
};

start();
