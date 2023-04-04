import { Telegraf, Markup, Scenes, session, Stage } from 'telegraf'

import jwt from "jsonwebtoken"
import dotenv from "dotenv"

const { enter, leave } = Stage;
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply("Hello Mom!")
})
bot.hears(/service des1k/i, (ctx) => {
    const message = 'Вы можете оформить заявку здесь';
    const user_id = ctx.from.id
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET)
    console.log(token)
    const url = "https://example.com"

    const inlineKeyboard = Markup.inlineKeyboard([
        Markup.button.url('Открыть в браузере', url),
    ]);

    return ctx.reply(message, inlineKeyboard);
});


bot.hears('Помощь Service Desk', (ctx) => {
    ctx.reply('Какая тема помощи?')
    ctx.scene.enter('helpTopic')
})

const helpTopicScene = new Scenes('helpTopic')
helpTopicScene.enter((ctx) => ctx.reply('Опишите проблему'))
helpTopicScene.on('text', (ctx) => {
    ctx.session.helpTopic = ctx.message.text
    ctx.scene.enter('problemDescription')
})

const problemDescriptionScene = new Scenes('problemDescription')
problemDescriptionScene.enter((ctx) => {
    ctx.reply('Выберите сервис из списка:', Markup.keyboard([
        Markup.button.callback('1.01 Поиск и восстановление писем', '1.01'),
        Markup.button.callback('1.02 Настройка почты на компьютере', '1.02'),
        Markup.button.callback('1.03 Настройка почты на мобильном устройстве', '1.03'),
    ]).oneTime())
})
problemDescriptionScene.on('text', (ctx) => {
    ctx.session.problemDescription = ctx.message.text
    ctx.reply('Пожалуйста, выберите сервис из списка')
})
problemDescriptionScene.on('callback_query', (ctx) => {
    ctx.session.service = ctx.callbackQuery.data
    ctx.reply(`Вы выбрали ${ctx.callbackQuery.data}`)
})

const stage = new Stage([helpTopicScene, problemDescriptionScene])
bot.use(session())
bot.use(stage.middleware())

bot.launch()