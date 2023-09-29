import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import connectDB from "./config/database.js";
import { getAllManuals, getById } from "./routes/api/manuals.api.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    keyboard: [[{ text: "Бухгалтерія" }, { text: "ЮД" }, { text: "Фітнес" }]],
    resize_keyboard: true,
  }),
};

const keyboardByCategory = {
  fitness: [],
  test: [],
};

const dataByCategory = async () => {
  const data = await getAllManuals();

  data.forEach((item) => {
    if (item.category === "fitness") {
      keyboardByCategory.fitness.push(item);
    } else if (item.category === "test") {
      keyboardByCategory.test.push(item);
    }
  });
};

dataByCategory();

const dataHandlers = {
  Бухгалтерія: {
    category: "test",
    successMessage: "Боже поможи",
  },
  ЮД: {
    category: "test",
    successMessage: "Хтось нарвався?",
  },
  Фітнес: {
    category: "fitness",
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
      const { category, successMessage } = dataHandlers[text];
      const data = keyboardByCategory[category];

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
    console.log(textId);

    // const findManual = async (textId) => {
    //   for (const categoryData of Object.values(dataHandlers)) {
    //     const data = await categoryData.getAllData();
    //     const selectedManual = data.find((item) => item.id == textId);

    //     if (selectedManual) {
    //       return selectedManual;
    //     }
    //   }
    //   return null;
    // };

    // const selectedManual = await findManual(textId);

    // if (selectedManual) {
    //   const { recipients, title, body, category } = selectedManual;

    //   const htmlMessage = `
    //   Адресати: ${recipients}\n\nТема листа: ${title}, ПОД, ПІБ\n
    //   <b>Ситуація:</b> ${body}\n
    //   <b>Інфо про клієнта</b>
    //   ПІБ:
    //   Код анкети:
    //   Абонемент:\n
    //   `;

    //   bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
    // } else {
    //   bot.sendMessage(chatId, "Хм, щось пішло не так");
    // }
  });
};

start();
//mironiak.yana@sportlife.kiev.ua, kovenia.vladyslav@sportlife.kiev.ua, Biliatynska.Yuliia@sportlife.kiev.ua, scherbakova.alla@sportlife.kiev.ua
