# CarStore - Сайт по продаже автомобилей

CarStore - это веб-приложение для продажи автомобилей, аналог kolesa.kz. Проект разработан с использованием React.js для фронтенда и Node.js с Express для бэкенда.

## Особенности

- Просмотр списка автомобилей с фильтрацией
- Детальная страница автомобиля
- Добавление новых объявлений
- Личный кабинет пользователя
- Адаптивный дизайн

## Технологии

- **Frontend**: React.js, Bootstrap, HTML5, CSS3
- **Backend**: Node.js, Express
- **Хранение данных**: JSON-файлы (имитация БД)
- **Контейнеризация**: Docker

## Установка и запуск

### Без использования Docker

#### Backend

cd backend
npm install
npm start

Backend будет доступен по адресу http://localhost:5000

#### Frontend

cd frontend
npm install
npm start

Frontend будет доступен по адресу http://localhost:3000

### С использованием Docker

docker-compose up

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## API Endpoints

### Автомобили

- `GET /api/cars` - Получить список всех автомобилей
- `GET /api/cars?brand=Toyota&model=Camry` - Фильтрация автомобилей
- `GET /api/cars/:id` - Получить информацию о конкретном автомобиле
- `POST /api/cars` - Добавить новое объявление
- `PUT /api/cars/:id` - Обновить информацию об автомобиле
- `DELETE /api/cars/:id` - Удалить объявление

### Пользователи

- `POST /api/users/register` - Регистрация нового пользователя
- `POST /api/users/login` - Авторизация пользователя
- `GET /api/users/profile` - Получить профиль текущего пользователя

## Структура проекта

carstore/
├── backend/             # Серверная часть
│   ├── data/            # Данные (JSON-файлы)
│   ├── routes/          # Маршруты API
│   ├── server.js        # Основной файл сервера
│   └── package.json     # Зависимости для backend
├── frontend/            # Клиентская часть (React)
│   ├── public/          # Статичные файлы
│   ├── src/             # Исходный код React
│   │   ├── components/  # Компоненты React
│   │   ├── pages/       # Страницы React
│   │   ├── services/    # Сервисы для работы с API
│   │   └── App.js       # Основной компонент
│   └── package.json     # Зависимости для frontend
└── docker-compose.yml   # Конфигурация Docker

## Скриншоты

(Здесь должны быть скриншоты веб-приложения)

## Как внести свой вклад

1. Fork репозиторий
2. Создайте ветку для новой функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -am 'Add some amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request
