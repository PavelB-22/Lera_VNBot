const { loadServices, saveServices, isValidUrl } = require('./utils');
require('dotenv').config(); // Для загрузки переменных окружения из .env

const ADMIN_USER_ID = process.env.ADMIN_USER_ID; // Получаем ID администратора

// Функция для обработки команд администратора
async function handleAdminCommands(bot, msg) {
    const userId = msg.from.id;
    const text = msg.text;

    // Проверяем, является ли пользователь администратором
    if (userId !== parseInt(ADMIN_USER_ID)) {
        return bot.sendMessage(userId, 'У вас нет прав для выполнения этой команды.');
    }

    // Обработка команды "Редактирование"
    if (text === 'Редактирование') {
        console.log('Администратор нажал "Редактирование"');  // Отладочное сообщение
        // Показываем кнопки для редактирования
        return bot.sendMessage(userId, 'Выберите действие:', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Добавить услугу' }, { text: 'Удалить услугу' }],
                    [{ text: 'Добавить блок' }, { text: 'Удалить блок' }],
                    [{ text: 'Вернуться назад' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true // Опционально: скрываем клавиатуру после выбора
            }
        });
    }

    // Обработка команд для добавления и удаления услуг и блоков
    if (text === 'Добавить услугу') {
        console.log('Добавление услуги');  // Отладочное сообщение
        bot.sendMessage(userId, 'Введите данные услуги в формате: Название блока, Название услуги, ссылка');
        bot.once('message', (msg) => {
            const data = msg.text.split(',');
            if (data.length === 3) {
                const [blockName, serviceName, serviceLink] = data.map(item => item.trim());

                // Проверка корректности ссылки
                if (!isValidUrl(serviceLink)) {
                    return bot.sendMessage(userId, 'Неверный формат ссылки. Попробуйте снова.');
                }

                const services = loadServices();
                const block = services.find(block => block.block === blockName);
                if (block) {
                    block.services.push({ name: serviceName, link: serviceLink });
                } else {
                    services.push({ block: blockName, services: [{ name: serviceName, link: serviceLink }] });
                }
                saveServices(services);
                bot.sendMessage(userId, `Услуга "${serviceName}" добавлена в блок "${blockName}".`);
            } else {
                bot.sendMessage(userId, 'Неверный формат данных. Попробуйте снова.');
            }
        });
    } else if (text === 'Удалить услугу') {
        console.log('Удаление услуги');  // Отладочное сообщение
        const services = loadServices();
        const serviceList = services.flatMap((block, blockIndex) =>
            block.services.map((service, serviceIndex) => {
                return `${blockIndex + 1}.${serviceIndex + 1} ${block.block} - ${service.name}`;
            })
        ).join('\n');
        bot.sendMessage(userId, `Выберите услугу для удаления:\n${serviceList}`);
        bot.once('message', (msg) => {
            const choice = msg.text.split('.');
            const [blockIndex, serviceIndex] = choice.map(num => parseInt(num) - 1);
            if (blockIndex >= 0 && serviceIndex >= 0 && services[blockIndex] && services[blockIndex].services[serviceIndex]) {
                const serviceName = services[blockIndex].services[serviceIndex].name;
                services[blockIndex].services.splice(serviceIndex, 1);
                saveServices(services);
                bot.sendMessage(userId, `Услуга "${serviceName}" удалена.`);
            } else {
                bot.sendMessage(userId, 'Неверный выбор. Попробуйте снова.');
            }
        });
    } else if (text === 'Добавить блок') {
        console.log('Добавление блока');  // Отладочное сообщение
        bot.sendMessage(userId, 'Введите название блока для добавления:');
        bot.once('message', (msg) => {
            const blockName = msg.text.trim();
            if (blockName) {
                const services = loadServices();
                services.push({ block: blockName, services: [] });
                saveServices(services);
                bot.sendMessage(userId, `Блок "${blockName}" добавлен.`);
            } else {
                bot.sendMessage(userId, 'Название блока не может быть пустым. Попробуйте снова.');
            }
        });
    } else if (text === 'Удалить блок') {
        console.log('Удаление блока');  // Отладочное сообщение
        const services = loadServices();
        const blockList = services.map((block, index) => `${index + 1}. ${block.block}`).join('\n');
        bot.sendMessage(userId, `Выберите блок для удаления:\n${blockList}`);
        bot.once('message', (msg) => {
            const blockIndex = parseInt(msg.text) - 1;
            if (blockIndex >= 0 && services[blockIndex]) {
                const blockName = services[blockIndex].block;
                services.splice(blockIndex, 1);
                saveServices(services);
                bot.sendMessage(userId, `Блок "${blockName}" удален.`);
            } else {
                bot.sendMessage(userId, 'Неверный выбор. Попробуйте снова.');
            }
        });
    } else if (text === 'Вернуться назад') {
        console.log('Возвращаемся в главное меню');  // Отладочное сообщение
        // Возвращаемся в главное меню
        bot.sendMessage(userId, 'Вы вернулись в главное меню. Выберите опцию:', {
            reply_markup: {
                keyboard: [
                    ['Перечень услуг', 'Подробнее об услугах'],
                    ['Связь с Валерией', 'Акции'],
                    ['Редактирование']  // Кнопка для админа
                ],
                resize_keyboard: true
            }
        });
    }
}

module.exports = { handleAdminCommands };
