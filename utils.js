const fs = require('fs');
const path = require('path');

// Путь к файлу с услугами
const servicesFilePath = path.join(__dirname, 'services.json');

// Функция для загрузки услуг
function loadServices() {
    try {
        const data = fs.readFileSync(servicesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        return [];  // Возвращаем пустой массив в случае ошибки
    }
}

// Функция для сохранения услуг
function saveServices(services) {
    try {
        const data = JSON.stringify(services, null, 2);  // Отформатируем с отступами
        fs.writeFileSync(servicesFilePath, data, 'utf8');
    } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
    }
}

// Функция для проверки правильности URL
function isValidUrl(url) {
    const regex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\- .\/?%&=]*)?$/i;
    return regex.test(url);

}
// Функция для загрузки услуг из services.json
function loadServices() {
    const data = fs.readFileSync('services.json', 'utf8');
    return JSON.parse(data);
}

// Функция для разбивки длинного текста на несколько частей
function chunkText(text, maxLength = 4096) {
    const chunks = [];
    while (text.length > 0) {
        chunks.push(text.substring(0, maxLength));
        text = text.substring(maxLength);
    }
    return chunks;
}

module.exports = { loadServices, chunkText };

module.exports = {chunkText, loadServices, saveServices, isValidUrl };
