const { loadServices } = require('./utils'); // Импортируем функцию для загрузки услуг из файла
require('dotenv').config(); // Чтобы загрузить переменные из .env

const ADMIN_USER_ID = parseInt(process.env.ADMIN_USER_ID, 10); // Получаем ID администратора из .env

// Функция для приветствия пользователя
async function greetUser(bot, msg) {
    try {
        const userName = msg.from.first_name || 'пользователь';
        const userId = msg.from.id;

        const keyboard = userId === ADMIN_USER_ID
            ? [
                ['Перечень услуг', 'Подробнее об услугах'],
                ['Связь с Валерией', 'Акции'],
                ['Редактирование'], // Кнопка для админа
            ]
            : [
                ['Перечень услуг', 'Подробнее об услугах'],
                ['Связь с Валерией', 'Акции'],
            ];

        await bot.sendPhoto(userId, './images/cat1.png', {
            caption: `${userName}, категорически Вас приветствую! Я бот по записи к мастеру-Валерия.\nВыберите опцию, чтобы я смог вам помочь.`,
            reply_markup: {
                keyboard,
                resize_keyboard: true,
            },
        });
    } catch (error) {
        console.error('Ошибка при приветствии пользователя:', error);
    }
}

// Функция для отображения перечня услуг с нумерацией (без ссылок)
async function showServices(bot, userId) {
    try {
        const services = loadServices();
        let serviceList = '';
        let counter = 1;

        services.forEach(block => {
            serviceList += `\n<b>${block.block}</b>\n`; // Заголовок блока
            block.services.forEach(service => {
                serviceList += `${counter}. ${service.name}\n`;
                counter++;
            });
            serviceList += '\n';
        });

        if (!serviceList.trim()) {
            serviceList = 'Услуги не найдены.';
        }

        const maxTextLength = 4096; // Максимальная длина текста для одного сообщения
        while (serviceList.length > maxTextLength) {
            await bot.sendMessage(userId, `Наши услуги:\n${serviceList.slice(0, maxTextLength)}`, {
                parse_mode: 'HTML',
            });
            serviceList = serviceList.slice(maxTextLength);
        }

        if (serviceList) {
            await bot.sendMessage(userId, `Наши услуги:\n${serviceList}`, {
                parse_mode: 'HTML',
            });
        }

        await bot.sendPhoto(userId, './images/cat2.png');
        await bot.sendMessage(userId, 'Выберите номер услуги для записи');
    } catch (error) {
        console.error('Ошибка при отображении услуг:', error);
        await bot.sendMessage(userId, 'Произошла ошибка при загрузке услуг. Попробуйте позже.');
    }
}

// Функция для получения услуги по номеру
function getServiceByNumber(serviceNumber, services) {
    let counter = 1;
    for (const block of services) {
        for (const service of block.services) {
            if (counter === serviceNumber) {
                return service;
            }
            counter++;
        }
    }
    return null; // Если услуга не найдена
}

// Обработка выбора услуги
async function handleServiceSelection(bot, msg) {
    try {
        const userId = msg.from.id;
        const userMessage = msg.text;

        const services = loadServices();
        if (!isNaN(userMessage) && parseInt(userMessage, 10) > 0) {
            const serviceNumber = parseInt(userMessage, 10);
            const serviceInfo = getServiceByNumber(serviceNumber, services);

            if (serviceInfo) {
                await bot.sendMessage(userId, `Вы выбрали услугу: ${serviceInfo.name}`);
                await bot.sendMessage(userId, `Для записи перейдите по ссылке: ${serviceInfo.link}`, {
                    parse_mode: 'HTML',
                });
            } else {
                await bot.sendMessage(userId, 'Неверный номер услуги. Пожалуйста, выберите правильный номер.');
            }
        } else {
            await bot.sendMessage(userId, 'Пожалуйста, отправьте только номер услуги.');
        }
    } catch (error) {
        console.error('Ошибка при обработке выбора услуги:', error);
        await bot.sendMessage(userId, 'Произошла ошибка. Попробуйте позже.');
    }
}

// Функция для отображения ссылки на запись
async function showAppointmentLink(bot, userId) {
    try {
        await bot.sendPhoto(userId, './images/cat3.png', {
            caption: 'Для записи перейдите по ссылке: https://dikidi.ru/ru/profile/vn_beauty_studio_1700345/master/3662474',
        });
    } catch (error) {
        console.error('Ошибка при отображении ссылки на запись:', error);
    }
}

// Функция для связи с Валерией
async function contactValeria(bot, userId) {
    try {
        await bot.sendMessage(userId, 'Свяжитесь с Валерией через Telegram: @Valereal01');
    } catch (error) {
        console.error('Ошибка при связи с Валерией:', error);
    }
}

// Функция для отображения акций
async function showPromotions(bot, userId) {
    try {
        await bot.sendPhoto(userId, './images/cat4.png', {
            caption: 'Смотрите наши актуальные акции!',
        });
    } catch (error) {
        console.error('Ошибка при отображении акций:', error);
    }
}

// Основная обработка сообщений от пользователей
function handleUserMessage(bot, msg) {
    const userId = msg.from.id;
    const text = msg.text;
    if (text === 'Перечень услуг') {
        showServices(bot, userId);
    } else if (text === 'Подробнее об услугах') {
        showAppointmentLink(bot, userId);
    } else if (text === 'Связь с Валерией') {
        contactValeria(bot, userId);
    } else if (text === 'Акции') {
        showPromotions(bot, userId);
    } else if (text === 'Редактирование' && userId === ADMIN_USER_ID) {
        bot.sendMessage(userId, 'Выберите действие для редактирования:');
    } else {
        handleServiceSelection(bot, msg);
    }
}
module.exports = { greetUser, handleUserMessage, contactValeria };