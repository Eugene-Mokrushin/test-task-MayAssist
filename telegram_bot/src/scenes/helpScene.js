// bot.hears(/Помощь Service Desk/i, (ctx) => {

//     let topic
//     let issue
//     const user_id = ctx.from.id
//     const token = jwt.sign({ user_id }, process.env.JWT_SECRET)

//     ctx.reply("Какая тема обращения?");
//     topic = ctx.message?.text;

//     ctx.reply("Опишите проблему")
//     issue = ctx.message?.text;

//     const message = 'Вы можете оформить заявку здесь';
//     const url = "https://example.com"

//     const inlineKeyboard = Markup.inlineKeyboard([
//         Markup.button.callback('Открыть в браузере', "handleForm"),
//     ]);
//     ctx.reply(topic, issue, token)

//     bot.action("handleForm", (ctx) => {
//         console.log(ctx)
//     })
//     return ctx.reply(message, inlineKeyboard);
// });

// const helpTopicScene = new Scenes('helpTopic')
// helpTopicScene.enter((ctx) => ctx.reply('Опишите проблему'))
// helpTopicScene.on('text', (ctx) => {
//     ctx.session.helpTopic = ctx.message.text
//     ctx.scene.enter('problemDescription')
// })

// const problemDescriptionScene = new Scenes('problemDescription')
// problemDescriptionScene.enter((ctx) => {
//     ctx.reply('Выберите сервис из списка:', Markup.keyboard([
//         Markup.button.callback('1.01 Поиск и восстановление писем', '1.01'),
//         Markup.button.callback('1.02 Настройка почты на компьютере', '1.02'),
//         Markup.button.callback('1.03 Настройка почты на мобильном устройстве', '1.03'),
//     ]).oneTime())
// })
// problemDescriptionScene.on('text', (ctx) => {
//     ctx.session.problemDescription = ctx.message.text
//     ctx.reply('Пожалуйста, выберите сервис из списка')
// })
// problemDescriptionScene.on('callback_query', (ctx) => {
//     ctx.session.service = ctx.callbackQuery.data
//     ctx.reply(`Вы выбрали ${ctx.callbackQuery.data}`)
// })

// const stage = new Stage([helpTopicScene, problemDescriptionScene])
// bot.use(session())
// bot.use(stage.middleware())
