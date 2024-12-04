//#stock-service/stock.js
import express from 'express';
const router = express.Router();
import sendQuery from "../db.js";

// получение остатков по фильтрам
router.get('/', async (req, res) => {
    const filters = req.body;
    if (!filters) {
        res.json({error: 'Empty data'});
        return;
    }
    const result = await sendQuery('getStock', filters);
    res.json(result);
});

// создание остатка
router.post('/', async (req, res) => {
    const stock = req.body;
    if (!stock) {
        res.json({error: 'Empty data'});
        return;
    }
    const result = await sendQuery('createStock', stock);
    res.json(result);
});

// увеличение остатка
router.put('/increase', async (req, res) => {
    const stock = req.body;
    if (!stock) {
        res.json({error: 'Empty data'});
        return;
    }
    const result = await sendQuery('increaseStock', stock);
    res.json(result);
});

// уменьшение остатка
router.put('/decrease', async (req, res) => {
    const stock = req.body;
    if (!stock) {
        res.json({error: 'Empty data'});
        return;
    }
    const result = await sendQuery('decreaseStock', stock);
    res.json(result);
});


export default router;