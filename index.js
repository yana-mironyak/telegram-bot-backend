import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import handlebars from "handlebars";
import fs from "fs";
import nodemailer from "nodemailer";
// import { GoogleAuth } from "google-auth-library";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const templateSource = fs.readFileSync("emailTemplate.hbs", "utf8");
const template = handlebars.compile(templateSource);

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
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    "./manual-sl-bot-af6d6e6bf571.json";

  // const auth = new GoogleAuth();
  // const client = await auth.getClient();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      type: "OAuth2",
      user: "sportlife.manual@gmail.com",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },
  });

  function sendEmailWithTemplate(to, subject, message) {
    const data = {
      subject: "Тема листа",
      message: "Текст листа",
    };

    const emailBody = template(data);

    transporter.sendMail({ to, subject, html: emailBody }, (error, info) => {
      if (error) {
        console.log("Помилка при відправленні листа:", error);
      } else {
        console.log("Лист відправлено:", info.response);
      }
    });
  }

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
      return bot.sendMessage(chatId, "Боже поможи", buh);
    }

    if (text === "ЮД") {
      return bot.sendMessage(chatId, "Хтось нарвався?", loyer);
    }

    if (text === "Фітнес") {
      return bot.sendMessage(chatId, "Ахрана-атмєна", fitness);
    }

    return bot.sendMessage(chatId, "Якась хуйня");
  });

  bot.on("callback_query", (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (data === "Відміна запізення на пошті") {
      // return bot.sendMessage(
      //   chatId,
      //   "Адресати: example@example\\.com, example@example\\.com, example@example\\.com\n\nТема листа: Ситуація з клієнтом, ПОД, ПІБ\n\nТіло листа ↓↓↓\n\n*Ситуація:*\n*Завдання:*\n\n*Інформація про клієнта:*\nПІБ:\nКатегорія картки:\nКод анкети:",
      //   {
      //     parse_mode: "MarkdownV2",
      //   }
      // );
      const to = "mironiak.yana@sportlife.kiev.ua";
      const subject = "Відміна запізнення, ПОД, ПІБ";
      const message = "Текст листа";

      sendEmailWithTemplate(to, subject, message);
    }
    console.log(data);
    bot.sendMessage(chatId, `${data}`);
  });
};

start();
