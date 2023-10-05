import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import connectDB from "./config/database.js";
import { getAllManuals, getById } from "./routes/api/manuals.api.js";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    keyboard: [
      [
        { text: "Бухгалтерія" },
        { text: "ЮД" },
        { text: "Фітнес" },
        { text: "Сервіс" },
      ],
    ],
    resize_keyboard: true,
  }),
};

const keyboardByCategory = {
  fitness: [],
  legal: [],
  accounting: [],
  service: [],
};

const dataByCategory = async () => {
  const data = await getAllManuals();

  data.forEach((item) => {
    if (item.category === "fitness") {
      keyboardByCategory.fitness.push(item);
    }
    if (item.category === "legal") {
      keyboardByCategory.legal.push(item);
    }
    if (item.category === "accounting") {
      keyboardByCategory.accounting.push(item);
    } else if (item.category === "service") {
      keyboardByCategory.service.push(item);
    }
  });
};

dataByCategory();

const dataHandlers = {
  Бухгалтерія: {
    category: "accounting",
    successMessage: "Боже поможи",
  },
  ЮД: {
    category: "legal",
    successMessage: "Хтось нарвався?",
  },
  Фітнес: {
    category: "fitness",
    successMessage: "Ахрана-атмєна",
  },
  Сервіс: {
    category: "service",
    successMessage: "Попрошайкі по знижці",
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
      return bot.sendMessage(
        chatId,
        "Шо вже трапилось? Тицяй категорію",
        options
      );
    }

    if (text === "/categories") {
      return bot.sendMessage(chatId, "Ну погнали", options);
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

    const findManual = async (textId) => {
      const manual = await getById(textId);

      if (manual) {
        return manual;
      }

      return null;
    };

    const selectedManual = await findManual(textId);
    const { recipients, title, body, category, task } = selectedManual;

    if (selectedManual) {
      if (category === "fitness") {
        const htmlMessage = `
        <u>Адресати:</u> ${recipients}\n\n<u>Тема листа:</u> ${title}, ПОД, ПІБ\n\n<u>Тіло листа:</u>
        <b>Ситуація:</b> ${body}\n
        <b>Інфо про клієнта</b>
        ПІБ:
        Код анкети:\n
        <i>Обов'язково прикріпити скрін проходів</i>     
        `;

        bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
      }
      if (category === "legal") {
        const htmlMessage = `
        <u>Адресати:</u> ${recipients}\n\n<u>Тема листа:</u> ${title}, ПОД, ПІБ\n\n<u>Тіло листа:</u>
        <b>Ситуація:</b> ${body}\n
        <b>Задача:</b> ${task}\n
        <b>Інфо про клієнта</b>
        ПІБ:
        Код анкети:
        Абонемент:
        Ціна:
        № договору:
        Дата оформлення:\n
        <i>Обов'язково прикріпити скрін анкети клієнта та вкладку "абонементи"</i> 
        `;

        bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
      }
      if (category === "accounting") {
        if (title === "Перенос грошових коштів з депозита") {
          const htmlMessage = `
          <u>Адресати:</u> ${recipients}\n\n<u>Тема листа:</u> ${title}, ПОД, ПІБ\n\n<u>Тіло листа:</u>
          <b>Ситуація:</b> ${body}\n
          <b>Задача:</b> ${task}\n
          <b>Причина:</b> Помилково поклали гроші не на ту картку\n
          <b>Інфо про клієнта 1 (перенести з)</b>
          ПІБ:
          Код анкети:
          <b>Інфо про клієнта 2 (перенести на)</b>
          ПІБ:
          Код анкети:
          `;

          bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
        }
        const htmlMessage = `
        <u>Адресати:</u> ${recipients}\n\n<u>Тема листа:</u> ${title}, ПОД, ПІБ\n\n<u>Тіло листа:</u>
        <b>Ситуація:</b> ${body}\n
        <b>Задача:</b> ${task}\n
        <b>Причина:</b> помилка менеджера\n
        <b>Інфо про клієнта</b>
        ПІБ:
        Код анкети:
        Дата оформлення:\n
        <i>Обов'язково прикріпити заяву клієнта</i> 
        `;

        bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
      }
      if (category === "service") {
        const htmlMessage = `
        <u>Адресати:</u> ${recipients}\n\n<u>Тема листа:</u> ${title}, ПОД, ПІБ\n\n<u>Тіло листа:</u>
        <b>Ситуація:</b> ${body}\n
        <b>Задача:</b> ${task}\n
        <b>Інфо про клієнта</b>
        ПІБ:
        Код анкети:
        Абонемент:\n
        <i>Прикріпити відповідний документ (довідка, закордонний паспорт, т.д</i> 
        `;

        bot.sendMessage(chatId, htmlMessage, { parse_mode: "HTML" });
      }
    } else {
      bot.sendMessage(chatId, "Хм, щось пішло не так");
    }
  });
};

start();
