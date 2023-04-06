import { Telegraf, Scenes, session, Markup } from "telegraf"

import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.replyWithHTML(`<b>Бот MayAssist</b>`)
    ctx.replyWithHTML(`Доступны следующие сервисы: \n • Помощь Service Desk`)
})

const serviceDeskScene = new Scenes.WizardScene(
    'serviceDesk',
    (ctx) => {
        ctx.wizard.state = {};
        ctx.reply('Какая тема обращения?');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.topic = ctx.message.text;
        ctx.reply('Опишите проблему');
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.wizard.state.issue = ctx.message.text;;
        const helpMenu = Markup.inlineKeyboard([
            Markup.button.callback('1.01', '55712'),
            Markup.button.callback('1.02', '55694'),
            Markup.button.callback('1.03', '55646'),
        ]);
        ctx.replyWithHTML(
            'Выберите сервис \n\n ✉️ <b>1.01</b> Поиск и восстановление писем \n\n 🖥 <b>1.02</b> Настройка почты на компьютере \n\n 📱<b>1.03</b> Настройка почты на мобильном устройстве',
            helpMenu);
        return ctx.wizard.next()
    },
    async (ctx) => {
        if (ctx.callbackQuery) {
            ctx.wizard.state.service = ctx.callbackQuery.data;
        } else {
            ctx.wizard.state.service = '55712';
        }

        const chat_id = ctx.chat.id;
        const messageId = ctx.callbackQuery.message.message_id;
        await ctx.telegram.deleteMessage(chat_id, messageId);

        // const user_id = ctx.from.id
        // const callbackQuery = ctx.callbackQuery.id
        const token = jwt.sign({ chat_id }, process.env.JWT_SECRET)
        const topic = Buffer.from(ctx.wizard.state.topic, "utf-8").toString("base64")
        const issue = Buffer.from(ctx.wizard.state.issue, "utf-8").toString("base64")
        const service = ctx.wizard.state.service
        const url = `${process.env.FRONT_URL}apps/sd/new_issue?jwt_token=${token}&topic=${topic}&issue_body=${issue}&service_id=${service}`

        console.log(url)
        const inlineKeyboard = Markup.inlineKeyboard([
            Markup.button.url('Открыть в браузере', url)
        ]);
        ctx.reply("Оставьте заявку здесь", inlineKeyboard)
        return ctx.scene.leave();
    }
);
const stage = new Scenes.Stage([serviceDeskScene])

bot.use(session())
bot.use(stage.middleware())

bot.hears('Помощь Service Desk', (ctx) => {
    ctx.scene.enter('serviceDesk')
})

bot.hears('Test', (ctx) => {
    const helpMenu = Markup.inlineKeyboard([
        Markup.button.callback('1.01', '1.01'),
        Markup.button.callback('1.02', '1.02'),
        Markup.button.callback('1.03', '1.03'),
    ]);
    ctx.reply('⚙️<b>Выберите сервис:</b> \n\n ✉️1.01 Поиск и восстановление писем \n\n 🖥 1.02 Настройка почты на компьютере \n\n 📱1.03 Настройка почты на мобильном устройстве',
        helpMenu);
})


bot.launch()