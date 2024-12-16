
// Загружаем переменные окружения из файла .env
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const { greetUser, handleUserMessage } = require('./user');  // Импортируем функции из user.js

// Получаем токен бота из переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Проверка, что токен задан
if (!TELEGRAM_BOT_TOKEN) {
    console.error('Ошибка: Telegram Bot Token не предоставлен!');
    process.exit(1);  // Останавливаем выполнение, если токен не найден
}

// Создаем бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    greetUser(bot, msg);  // Приветствуем пользователя
});

bot.on('message', (msg) => {
    handleUserMessage(bot, msg);  // Обрабатываем входящие сообщения, передавая bot и msg
});


// В случае ошибок
bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
});

