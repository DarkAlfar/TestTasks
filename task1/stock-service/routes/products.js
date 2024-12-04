//#stock-service/products.js
import express from 'express';
const router = express.Router();
import sendQuery from '../db.js';

// получение товаров по фильтрам
router.get('/', async (req, res) => {
    const filters = req.body;
    if (!filters) {
        res.json({error: 'Empty data'});
        return;
    }
    const result = await sendQuery('getProducts', filters);
    res.json(result);
});

// создание товара
router.post('/', async (req, res) => {
    const product = req.body;
    // проверяем, что данные не пустые (на типы будем проверять в сервисе для обращения к БД)
    if (!product) {
        res.json({error: 'Empty data'});
        return;
    }
    const result = await sendQuery('createProduct', product);
    res.json(result);
});

export default router;