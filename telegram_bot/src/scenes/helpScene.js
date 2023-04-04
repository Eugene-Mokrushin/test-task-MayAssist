import { Markup, Scenes } from 'telegraf';

const helpScene = new Scenes.BaseScene('help');
helpScene.enter((ctx) => {
    ctx.reply('Опишите проблему');
});
helpScene.use((ctx, next) => {
    ctx.session.helpTopic = ctx.message.text;
    return next();
});
helpScene.enter((ctx) => {
    const helpMenu = Markup.inlineKeyboard([
        Markup.button.callback('1.01 Поиск и восстановление писем', '1.01'),
        Markup.button.callback('1.02 Настройка почты на компьютере', '1.02'),
        Markup.button.callback('1.03 Настройка почты на мобильном устройстве', '1.03'),
    ]);
    ctx.reply('Выберите тему из списка:', helpMenu);
});

export default helpScene