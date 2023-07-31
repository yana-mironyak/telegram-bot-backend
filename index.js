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

const fitness = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Відміна запізення",
          callback_data: "Відміна запізення на пошті",
        },
      ],
      [
        {
          text: "Відміна оплати за групове заняття",
          callback_data: "Відміна оплати за групове заняття",
        },
      ],
      [{ text: "Скарга", callback_data: "Скарга" }],
    ],
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
      return bot.sendMessage(chatId, "Боже поможи", buh);
    }

    if (text === "ЮД") {
      return bot.sendMessage(chatId, "Хтось нарвався?", loyer);
    }

    if (text === "Фітнес") {
      try {
        const fitnessData = await getAllFitness();
        bot.sendMessage(chatId, JSON.stringify(fitnessData));
      } catch (error) {
        console.error("Error getting fitness data:", error);
        bot.sendMessage(chatId, "Виникла помилка при отриманні даних з бази.");
      }

      return;

      // return bot.sendMessage(chatId, "Ахрана-атмєна", fitness);
    }

    return bot.sendMessage(chatId, "Якась хуйня");
  });

  bot.on("callback_query", (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (data === "Відміна запізення на пошті") {
      bot.sendMessage(chatId, "Напиши свою пошту, я відправлю тобі шаблон");
      const to = "mironiak.yana@sportlife.kiev.ua";
      const subject = "Відміна запізнення, ПОД, ПІБ";
      const message = "Текст листа";

      sendEmailWithTemplate(to, subject, message);
    }

    bot.sendMessage(chatId, `${data}`);
  });
};

start();
