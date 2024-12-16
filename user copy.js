 //const { loadServices } = require('./utils'); // Импортируем функцию для загрузки услуг из файла
// require('dotenv').config();  // Чтобы загрузить переменные из .env

// const ADMIN_USER_ID = process.env.ADMIN_USER_ID;  // Получаем ID администратора из .env

// // Функция для приветствия пользователя
// async function greetUser(bot, msg) {
//     const userName = msg.from.first_name || 'пользователь';
//     const userId = msg.from.id;

//     // Проверка на админа
//     if (userId === parseInt(ADMIN_USER_ID)) {
//         // Если это администратор, добавляем кнопку "Редактирование"
//         await bot.sendPhoto(userId, './images/cat1.png', {
//             caption: `${userName}, категорически Вас приветствую! Я бот по записи к мастеру-Валерия.\nВыберите опцию, чтобы я смог вам помочь.`,
//             reply_markup: {
//                 keyboard: [
//                     ['Перечень услуг', 'Подробнее об услугах'],
//                     ['Связь с Валерией', 'Акции'],
//                     ['Редактирование']  // Кнопка для админа
//                 ],
//                 resize_keyboard: true
//             }
//         });
//     } else {
//         // Для остальных пользователей кнопки без "Редактирования"
//         await bot.sendPhoto(userId, './images/cat1.png', {
//             caption: `${userName}, категорически Вас приветствую! Я бот по записи к мастеру-Валерия.\nВыберите опцию, чтобы я смог вам помочь.`,
//             reply_markup: {
//                 keyboard: [
//                     ['Перечень услуг', 'Подробнее об услугах'],
//                     ['Связь с Валерией', 'Акции']
//                 ],
//                 resize_keyboard: true
//             }
//         });
//     }
// }

// // Функция для отображения перечня услуг с нумерацией (без ссылок)
// async function showServices(bot, userId) {
//     const services = loadServices();  // Загружаем услуги из файла
//     let serviceList = '';
//     let counter = 1;

//     // Создаем строку с услугами, добавляя нумерацию и заголовки блоков
//     services.forEach(block => {
//         serviceList += `\n<b>${block.block}</b>\n`; // Заголовок блока
//         block.services.forEach(service => {
//             serviceList += `${counter}. ${service.name}\n`; // Нумерация и имя услуги
//             counter++;
//         });
//         serviceList += '\n';
//     });

//     // Если список услуг пуст, выводим сообщение
//     if (serviceList === '') {
//         serviceList = 'Услуги не найдены.';
//     }

//     // Обрезаем строку, если она слишком длинная для Telegram
//     const maxTextLength = 4096; // Максимальная длина текста для одного сообщения
//     let remainingText = serviceList;

//     // Отправляем список услуг, разбивая на несколько сообщений, если нужно
//     while (remainingText.length > maxTextLength) {
//         const part = remainingText.slice(0, maxTextLength);
//         await bot.sendMessage(userId, `Наши услуги: \n${part}`, {
//             parse_mode: 'HTML' // Используем HTML для отображения форматированного текста
//         });
//         remainingText = remainingText.slice(maxTextLength);
//     }

//     // Отправляем оставшуюся часть списка услуг
//     if (remainingText.length > 0) {
//         await bot.sendMessage(userId, `Наши услуги: \n${remainingText}`, {
//             parse_mode: 'HTML' // Используем HTML для отображения форматированного текста
//         });
//     }

//     // Отправляем картинку
//     await bot.sendPhoto(userId, './images/cat2.png');

//     // Отправляем текстовое сообщение "Выберите номер услуги для записи"
//     await bot.sendMessage(userId, 'Выберите номер услуги для записи');
// }

// function getServiceByNumber(serviceNumber, services) {
//     console.log('Ищем услугу для номера:', serviceNumber);  // Логируем номер услуги
//     let counter = 1;
//     for (const block of services) {
//         for (const service of block.services) {
//             if (counter === serviceNumber) {
//                 console.log('Найдена услуга:', service);  // Логируем найденную услугу
//                 return service;
//             }
//             counter++;
//         }
//     }
//     return null; // Если услуга не найдена
// }

// // Эта функция будет обрабатывать ввод номера услуги
// async function handleServiceSelection(bot, msg) {
//     const userId = msg.from.id;
//     const userMessage = msg.text;

//     // Проверка: что пользователь отправил числовое сообщение
//     if (isNaN(userMessage)) {
//         await bot.sendMessage(userId, 'Пожалуйста, отправьте только номер услуги.');
//         return;
//     }

//     const services = loadServices();  // Загружаем услуги из файла
//     const serviceNumber = parseInt(userMessage);

//     console.log('Номер услуги:', serviceNumber);  // Логируем номер услуги

//     const serviceInfo = getServiceByNumber(serviceNumber, services);

//     if (serviceInfo) {
//         await bot.sendMessage(userId, `Вы выбрали услугу: ${serviceInfo.name}`);
//         await bot.sendMessage(userId, `Для записи перейдите по ссылке: ${serviceInfo.link}`, {
//             parse_mode: 'HTML'
//         });
//     } else {
//         await bot.sendMessage(userId, 'Неверный номер услуги. Пожалуйста, выберите правильный номер.');
//         await bot.sendMessage(userId, 'Выберите номер услуги для записи');
//     }
// }

// // Функция для отображения записи на прием
// async function showAppointmentLink(bot, userId) {
//     await bot.sendPhoto(userId, './images/cat3.png', {
//         caption: 'Для записи перейдите по ссылке: https://dikidi.ru/ru/profile/vn_beauty_studio_1700345/master/3662474',
//     });
// }

// // Функция для отображения связи с Валерией
// async function contactValeria(bot, userId) {
//     await bot.sendMessage(userId, 'Свяжитесь с Валерией через Telegram: @Valereal01');
// }

// // Функция для отображения акций
// async function showPromotions(bot, userId) {
//     await bot.sendPhoto(userId, './images/cat4.png', {
//         caption: 'Смотрите наши актуальные акции!',
//     });
// }

// // Основная обработка сообщений от пользователей
// // Добавьте async перед функцией
// async function handleUserMessage(bot, msg) {
//     const userId = msg.from.id;
//     const text = msg.text;

//     // Проверка на команду Старт
//     if (text === '/start') {
//         greetUser(bot, msg);  // Приветствуем пользователя и показываем кнопки
//     } else if (text === 'Перечень услуг') {
//         showServices(bot, userId);  // Отображаем перечень услуг
//     } else if (text === 'Подробнее об услугах') {
//         showAppointmentLink(bot, userId);  // Ссылка для записи
//     } else if (text === 'Связь с Валерией') {
//         contactValeria(bot, userId);  // Отправляем контакт Валерии
//     } else if (text === 'Акции') {
//         showPromotions(bot, userId);  // Показываем акции
//     } else if (text === 'Редактирование' && userId === parseInt(ADMIN_USER_ID)) {
//         // Обработка действий администратора
//         bot.sendMessage(userId, 'Выберите действие для редактирования:');
//     } else {
//         // Проверка, является ли текст числовым значением (номер услуги)
//         const serviceNumber = parseInt(text);
//         if (!isNaN(serviceNumber)) {
//             handleServiceSelection(bot, msg);  // Обрабатываем ввод номера услуги
//         } else {
//             // Обработка текста, который не является номером услуги
//             await bot.sendMessage(userId, 'Пожалуйста, выберите номер услуги из перечня.');
//         }
//     }
// }

// // Регистрация обработчика сообщений
// module.exports = { greetUser, handleUserMessage, contactValeria };
