//#stock-service/db.js
import pkg from 'pg';
const {Client, Pool} = pkg;
import axios from 'axios';

// const client = new Client({
//     user: 'postgres',
//     host: 'postgres',
//     database: 'inventory',
//     password: 'postgres',
//     port: 5432,
// });

const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'inventory',
    password: 'postgres',
    port: 5432,
});

// функция проверки данных в запросах на корректность и типы (с учётом того, что запросы по фильтрам могут приходить не со всеми полями)
const operations = {
    createProduct: ['name', 'plu'],
    createStock: ['product_id', 'shop_id', 'quantity_on_shelf', 'quantity_in_order'],
    increaseStock: ['plu', 'shop_id', 'quantity_on_shelf', 'quantity_in_order'],
    decreaseStock: ['plu', 'shop_id', 'quantity_on_shelf', 'quantity_in_order'],
    getStock: ['plu', 'shop_id', 'shelfFrom', 'shelfTo', 'orderFrom', 'orderTo'],
    getProducts: ['name', 'plu'],
    getActions: ['shop_id', 'plu', 'dateFrom', 'dateTo', 'action', 'page', 'limit'],
    addAction: ['shop_id', 'plu', 'date', 'action']
};

const field_types = {
    product_id: 'number',
    name: 'string',
    plu: 'number',
    shop_id: 'number',
    quantity_on_shelf: 'number',
    quantity_in_order: 'number',
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
    const fields = operations[operation];
    if (!fields) return false;
    for (let field of fields) {
        if (data[field] !== undefined && typeof data[field] !== field_types[field]) return false;
    }
    return true;
}

const dbService = {
    createProduct: async (data) => {
        const {name, plu} = data;
        const query = `INSERT INTO products (name, plu) VALUES ('${name}', '${plu}') RETURNING *`;
        const {rows} = await pool.query(query);
        return rows[0];
    },
    createStock: async (data) => {
        const {plu, shop_id, quantity_on_shelf, quantity_in_order} = data;
        // const query = `INSERT INTO stock (product_id, shop_id, quantity_on_shelf, quantity_in_order) VALUES ('${product_id}', '${shop_id}', '${quantity_on_shelf}', '${quantity_in_order}') RETURNING *`;
        const query = `INSERT INTO stock (product_id, shop_id, quantity_on_shelf, quantity_in_order) VALUES ((SELECT id FROM products WHERE plu = '${plu}'), '${shop_id}', '${quantity_on_shelf}', '${quantity_in_order}') RETURNING *`;
        const {rows} = await pool.query(query);
        return rows[0];
    },
    increaseStock: async (data) => {
        const {plu, shop_id, quantity_on_shelf, quantity_in_order} = data;
        const query = `UPDATE stock SET quantity_on_shelf = quantity_on_shelf + ${quantity_on_shelf}, quantity_in_order = quantity_in_order + ${quantity_in_order} WHERE product_id = (SELECT id FROM products WHERE plu = '${plu}') AND shop_id = '${shop_id}' RETURNING *`;
        const {rows} = await pool.query(query);
        return rows[0];
    },
    decreaseStock: async (data) => {
        const {plu, shop_id, quantity_on_shelf, quantity_in_order} = data;
        const query = `UPDATE stock SET quantity_on_shelf = quantity_on_shelf - ${quantity_on_shelf}, quantity_in_order = quantity_in_order - ${quantity_in_order} WHERE product_id = (SELECT id FROM products WHERE plu = '${plu}') AND shop_id = '${shop_id}' RETURNING *`;
        const {rows} = await pool.query(query);
        return rows[0];
    },
    getStock: async (data) => {
        const {plu, shop_id, shelfFrom, shelfTo, orderFrom, orderTo} = data;
        let query = 'SELECT * FROM stock s INNER JOIN products p ON s.product_id = p.product_id WHERE 1=1';
        if (plu) query += ` AND p.plu = '${plu}'`;
        if (shop_id) query += ` AND s.shop_id = '${shop_id}'`;
        if (shelfFrom !== undefined) query += ` AND s.quantity_on_shelf >= ${shelfFrom}`;
        if (shelfTo !== undefined) query += ` AND s.quantity_on_shelf <= ${shelfTo}`;
        if (orderFrom !== undefined) query += ` AND s.quantity_in_order >= ${orderFrom}`;
        if (orderTo !== undefined) query += ` AND s.quantity_in_order <= ${orderTo}`;
        const {rows} = await pool.query(query);
        return rows;
    },
    getProducts: async (data) => {
        const {name, plu} = data;
        let query = 'SELECT * FROM products WHERE 1=1';
        if (name) query += ` AND name = '${name}'`;
        if (plu) query += ` AND plu = '${plu}'`;
        const {rows} = await pool.query(query);
        return rows;
    },
    // endpoint, который отдаст историю действий с фильтрами по:
    // - shop_id
    // - plu
    // - date (с-по)
    // - action
    // и постраничной навигацией
    // getActions: async (filters) => {
    //     const {shop_id, plu, dateFrom, dateTo, action, page = 1, limit = 20} = filters;
    //     const query = `SELECT * FROM actions WHERE shop_id = '${shop_id}' AND plu = '${plu}' AND date >= '${dateFrom}' AND date <= '${dateTo}' AND action = '${action}' LIMIT ${limit} OFFSET ${page * limit}`;
    //     const {rows} = await client.query(query);
    //     return rows;
    // },
    // addAction: async (action) => {
    //     const {shop_id, plu, date, action} = action;
    //     const query = `INSERT INTO actions (shop_id, plu, date, action) VALUES ('${shop_id}', '${plu}', '${date}', '${action}') RETURNING *`;
    //     const {rows} = await client.query(query);
    //     return rows[0];
    // }
};

// функция отправки действия в history-service
const sendAction = async (method, data) => {
    try {
        const actionData = {
            shop_id: data.shop_id || "0",
            plu: data.plu,
            date: new Date().toISOString(),
            action: method
        };
        const result = await axios.post('http://history-service:3002/action', actionData);
    } catch (e) {
        console.log(e.message);
    }
}

const sendQuery = async (method, data) => {
    try {
        console.log("sendQuery", method, data);
        if (checkData(method, data)) {
            // await client.connect();
            const result = await dbService[method](data);
            if (result) {
                // если запрос прошел успешно, то возвращаем результат и параллельно отправляем запрос в сервис history-service, но от него ответа не ждём
                sendAction(method, data);
            }
            // await client.end();
            return result || {error: 'Empty data'}
        }
        return {error: 'Invalid data'};
    } catch (e) {
        console.log(e.message);
        return {error: 'Internal error'};
    }
}

export default sendQuery;
