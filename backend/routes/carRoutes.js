const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены к загрузке'));
    }
  }
});

// Получить все автомобили с возможностью фильтрации
router.get('/', (req, res) => {
  try {
    const carsPath = path.join(__dirname, '../data/cars.json');
    let cars = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
    
    // Фильтрация
    const { brand, model, yearFrom, yearTo, priceFrom, priceTo } = req.query;
    
    if (brand) {
      cars = cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
    }
    
    if (model) {
      cars = cars.filter(car => car.model.toLowerCase().includes(model.toLowerCase()));
    }
    
    if (yearFrom) {
      cars = cars.filter(car => car.year >= parseInt(yearFrom));
    }
    
    if (yearTo) {
      cars = cars.filter(car => car.year <= parseInt(yearTo));
    }
    
    if (priceFrom) {
      cars = cars.filter(car => car.price >= parseInt(priceFrom));
    }
    
    if (priceTo) {
      cars = cars.filter(car => car.price <= parseInt(priceTo));
    }
    
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Получить конкретный автомобиль по ID
router.get('/:id', (req, res) => {
  try {
    const carsPath = path.join(__dirname, '../data/cars.json');
    const cars = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
    
    const car = cars.find(car => car.id === req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }
    
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Добавить новое объявление
router.post('/', upload.array('images', 5), (req, res) => {
  try {
    const carsPath = path.join(__dirname, '../data/cars.json');
    const cars = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
    
    // Генерируем ID для нового объявления
    const id = Date.now().toString();
    
    // Получаем пути к загруженным изображениям
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newCar = {
      id,
      ...req.body,
      price: parseInt(req.body.price),
      year: parseInt(req.body.year),
      images,
      createdAt: new Date().toISOString()
    };
    
    cars.push(newCar);
    
    fs.writeFileSync(carsPath, JSON.stringify(cars, null, 2));
    
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Обновить информацию об автомобиле
router.put('/:id', upload.array('images', 5), (req, res) => {
  try {
    const carsPath = path.join(__dirname, '../data/cars.json');
    let cars = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
    
    const carIndex = cars.findIndex(car => car.id === req.params.id);
    
    if (carIndex === -1) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }
    
    // Сохраняем старые данные и обновляем
    const oldCar = cars[carIndex];
    
    // Получаем пути к новым загруженным изображениям
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Объединяем старые и новые изображения, если не указано заменить все
    const images = req.body.replaceAllImages === 'true' ? newImages : [...oldCar.images, ...newImages];
    
    cars[carIndex] = {
      ...oldCar,
      ...req.body,
      price: req.body.price ? parseInt(req.body.price) : oldCar.price,
      year: req.body.year ? parseInt(req.body.year) : oldCar.year,
      images,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(carsPath, JSON.stringify(cars, null, 2));
    
    res.json(cars[carIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Удалить объявление
router.delete('/:id', (req, res) => {
  try {
    const carsPath = path.join(__dirname, '../data/cars.json');
    let cars = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
    
    const carIndex = cars.findIndex(car => car.id === req.params.id);
    
    if (carIndex === -1) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }