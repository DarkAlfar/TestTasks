//#history-service/app.js
/*
В сервис “истории действий с товарами” нужно отправлять все события, которые происходят с товарами или остатками. Общение сервисов может происходить любым способом. Сервис “истории действий с товарами или остатками” должен иметь endpoint, который отдаст историю действий с фильтрами по:
- shop_id
- plu
- date (с-по)
- action
и постраничной навигацией
 */
import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
const port = 3002;
const app = express();

app.use(bodyParser.json());

// в данную переменную будем складывать историю действий - все события, которые происходят с товарами или остатками (соответственно добавление продукта, создание остатка, увеличение/уменьшение остатка, учитывая, что у добавления продукта нет shop_id, а у остатков он есть)
// добавляем в истории, только при успешном действии
const history_actions = []
const actions = ['createProduct', 'createStock', 'increaseStock', 'decreaseStock'];

app.get('/action', async (req, res) => {
    const filters = req.body;
    if (!checkData('getActions', filters)) {
        res.status(400).send('Bad request');
        return;
    }
    let rows = history_actions;
    if (filters.shop_id) rows = rows.filter(row => row.shop_id === filters.shop_id);
    if (filters.plu) rows = rows.filter(row => row.plu === filters.plu);
    if (filters.dateFrom) rows = rows.filter(row => row.date >= filters.dateFrom);
    if (filters.dateTo) rows = rows.filter(row => row.date <= filters.dateTo);
    if (filters.action) rows = rows.filter(row => row.action === filters.action);
    //if (filters.page && filters.limit) rows = rows.slice((filters.page - 1) * filters.limit, filters.page * filters.limit);
    let page = filters.page || 1;
    let limit = filters.limit || 20;
    let offset = (page - 1) * limit;
    rows = rows.slice(offset, offset + limit);
    res.json(rows);
});

// добавление действия в историю
app.post('/action', async (req, res) => {
    const {shop_id, plu, date, action} = req.body;
    // сделаем проверку на допустимые действия тут
    if (action && !actions.includes(action)) {
        return
    }
    if (!checkData('addAction', req.body)) {
        res.status(400).send('Bad request');
        return;
    }
    history_actions.push({id: uuidv4(), shop_id, plu, date, action});
    res.json({status: 'ok'});
});

// функция проверки данных в запросах на корректность и типы (с учётом того, что запросы по фильтрам могут приходить не со всеми полями)
const operations = {
    getActions: ['shop_id', 'plu', 'dateFrom', 'dateTo', 'action', 'page', 'limit'],
    addAction: ['shop_id', 'plu', 'date', 'action']
};

const field_types = {
    plu: 'number',
    shop_id: 'number',
    date: 'string',
    dateFrom: 'string',
    dateTo: 'string',
    action: 'string',
    page: 'number',
    limit: 'number'
};

const checkData = (operation, data) => {
    if (!data || !operation) return false;
    const fields = operations[operation];
    if (!fields) return false;
    for (let field of fields) {
        if (data[field] !== undefined && typeof data[field] !== field_types[field]) return false;
    }
    return true;
}

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});