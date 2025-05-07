const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 5000;

// Проверяем существование директорий для данных
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Проверяем существование файлов с данными
const carsFile = path.join(dataDir, 'cars.json');
if (!fs.existsSync(carsFile)) {
  fs.writeFileSync(carsFile, JSON.stringify([]));
}

const usersFile = path.join(dataDir, 'users.json');
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршруты API
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app; // Для тестирования
