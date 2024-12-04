//#db-service/db-service.js
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

await client.connect();

// функция проверки данных в запросах на корректность и типы
const operations = {
    createProduct: ['name', 'plu'],
    createStock: ['plu', 'shop_id', 'shelf', 'order'],
    increaseStock: ['plu', 'shop_id', 'shelf', 'order'],
    decreaseStock: ['plu', 'shop_id', 'shelf', 'order'],
    getStocks: ['plu', 'shop_id', 'shelfFrom', 'shelfTo', 'orderFrom', 'orderTo'],
    getProducts: ['name', 'plu'],
    getActions: ['shop_id', 'plu', 'dateFrom', 'dateTo', 'action', 'page', 'limit'],
    addAction: ['shop_id', 'plu', 'date', 'action']
};

const field_types = {
    name: 'string',
    plu: 'string',
    shop_id: 'string',
    shelf: 'number',
    order: 'number',
    shelfFrom: 'number',
    shelfTo: 'number',
    orderFrom: 'number',
    orderTo: 'number',
    date: 'string',
    dateFrom: 'string',
    dateTo: 'string',
    action: 'string',
    page: 'number',
    limit: 'number'
};

const checkData = (operation, data) => {
    if (!data || !operation) return false;
    // сразу обозначим допустимые операции, необходимые поля и допустимые типы данных этих полей, чтобы не дублировать в каждом case
    const fields = operations[operation];
    if (!fields) return false;
    for (let field of fields) {
        if (!data[field] || typeof data[field] !== field_types[field]) return false;
    }
    return true;
}


const dbService = {
    createProduct: async (product) => {
        const {name, plu} = product;
        const query = `INSERT INTO products (name, plu) VALUES ('${name}', '${plu}') RETURNING *`;
        const {rows} = await client.query(query);
        return rows[0];
    },
    createStock: async (stock) => {
        const {plu, shop_id, shelf, order} = stock;
        const query = `INSERT INTO stocks (plu, shop_id, shelf, order) VALUES ('${plu}', '${shop_id}', '${shelf}', '${order}') RETURNING *`;
        const {rows} = await client.query(query);
        return rows[0];
    },
    increaseStock: async (stock) => {
        const {plu, shop_id, shelf, order} = stock;
        const query = `UPDATE stocks SET shelf = shelf + ${shelf}, order = order + ${order} WHERE plu = '${plu}' AND shop_id = '${shop_id}' RETURNING *`;
        const {rows} = await client.query(query);
        return rows[0];
    },
    decreaseStock: async (stock) => {
        const {plu, shop_id, shelf, order} = stock;
        const query = `UPDATE stocks SET shelf = shelf - ${shelf}, order = order - ${order} WHERE plu = '${plu}' AND shop_id = '${shop_id}' RETURNING *`;
        const {rows} = await client.query(query);
        return rows[0];
    },
    getStocks: async (filters) => {
        const {plu, shop_id, shelfFrom, shelfTo, orderFrom, orderTo} = filters;
        const query = `SELECT * FROM stocks WHERE plu = '${plu}' AND shop_id = '${shop_id}' AND shelf >= ${shelfFrom} AND shelf <= ${shelfTo} AND order >= ${orderFrom} AND order <= ${orderTo}`;
        const {rows} = await client.query(query);
        return rows;
    },
    getProducts: async (filters) => {
        const {name, plu} = filters;
        const query = `SELECT * FROM products WHERE name = '${name}' AND plu = '${plu}'`;
        const {rows} = await client.query(query);
        return rows;
    },
    // endpoint, который отдаст историю действий с фильтрами по:
    // - shop_id
    // - plu
    // - date (с-по)
    // - action
    // и постраничной навигацией
    getActions: async (filters) => {
        const {shop_id, plu, dateFrom, dateTo, action, page = 1, limit = 20} = filters;
        const query = `SELECT * FROM actions WHERE shop_id = '${shop_id}' AND plu = '${plu}' AND date >= '${dateFrom}' AND date <= '${dateTo}' AND action = '${action}' LIMIT ${limit} OFFSET ${page * limit}`;
        const {rows} = await client.query(query);
        return rows;
    },
    addAction: async (action) => {
        const {shop_id, plu, date, action} = action;
        const query = `INSERT INTO actions (shop_id, plu, date, action) VALUES ('${shop_id}', '${plu}', '${date}', '${action}') RETURNING *`;
        const {rows} = await client.query(query);
        return rows[0];
    }
};

// универсальный endpoint
app.post('/db', async (req, res) => {
    const {service, method, data} = req.body;
    if (checkData(method, data)) {
        const result = await dbService[method](data);
        res.json(result);
    }
    else {
        res.json({error: 'Invalid data'});
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});


