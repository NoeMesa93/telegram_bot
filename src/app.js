// Creation and configuration of the Express APP
const express = require('express');
const cors = require('cors');
const { Telegraf } = require('telegraf');
const axios = require('axios');

const User = require('./models/users.models');
const { historyCreate, normalResponse } = require('./utils/gpt');

require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

// Bot configuration
const bot = new Telegraf(process.env.BOT_TOKEN);
app.use(bot.webhookCallback('/telegrambot'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegrambot`)

// Route configuration
app.post('/telegrambot', (req, res) => res.send('Funciona'))

// Middlewares
bot.use(async (ctx, next) => {
    const user = await User.findOne({ telegram_id: ctx.message.from.id })

    if (!user) {
        ctx.message.from.telegram_id = ctx.message.from.id;
        delete ctx.message.from.id;
        await User.create(ctx.message.from)
    }
})

// Bot command
bot.command('test', async (ctx) => {
    await ctx.reply('Esto funciona👌')
})

bot.command('dado', async (ctx) => {
    await ctx.replyWithDice();
})

bot.command('tiempo', async (ctx) => {
    const ciudad = ctx.message.text.substring(8);

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=12cc61f3282afaca14152a6185f43de0&units=metric`)

        ctx.replyWithHTML(`<b>Tiempo en ${ciudad}</b>
      Temperatura: ${response.data.main.temp}ºC
      Máxima: ${response.data.main.temp_max}ºC
      Mínima: ${response.data.main.temp_min}ºC`)
        await ctx.replyWithLocation(response.data.coord.lat, response.data.coord.lon)
    } catch (error) {
        ctx.reply(`Ha ocurrido un error, vuelve a intentarlo: ${error.response.data.message}`)
    }
})

bot.command('historia', async (ctx) => {
    const topics = ctx.message.text.replace('/historia ', '');
    const [history, image] = await historyCreate(topics);
    await ctx.reply(history);
    await ctx.replyWithPhoto(image);
})

bot.on('location', ctx => {
    ctx.reply('Ubicación recibida')
});


bot.on('photo', ctx => {
    ctx.reply('Me has pasado una foto. También puedo estar atento a cuando cambias la foto del chat con NewChatPhoto')
});

bot.on('message', async ctx => {
    const response = await normalResponse(ctx.message.text);
    ctx.reply(response);
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json(err);
})

module.exports = app;