const axios = require('axios');

// const field_types = {
//     name: 'string',
//     plu: 'number',
//     shop_id: 'number',
//     quantity_on_shelf: 'number',
//     quantity_in_order: 'number',
//     shelfFrom: 'number',
//     shelfTo: 'number',
//     orderFrom: 'number',
//     orderTo: 'number',
//     date: 'string',
//     dateFrom: 'string',
//     dateTo: 'string',
//     action: 'string',
//     page: 'number',
//     limit: 'number'
// };

const testData = {
    plu: 4006,
    name: 'Test Product',
    shop_id: 2,
    quantity_on_shelf: 50,
    quantity_in_order: 20,
    date: '2021-07-01',
    action: ['createStock', 'increaseStock', 'decreaseStock', 'createProduct'],
    page: 2,
    limit: 30,
    shelfFrom: 40,
    shelfTo: 60,
    orderFrom: 10,
    orderTo: 30,
    dateFrom: '2021-06-01',
    dateTo: '2021-07-01',
}


const testAPI = async () => {
    try {
        // // 1. Создание магазина
        // const shop = await axios.post('http://localhost:3001/shops', {
        //     name: 'Test Shop',
        //     address: 'Test Address',
        // });
        // console.log('Shop created:', shop.data);

        // 2. Создание товара
        const product = await axios.post('http://localhost:3001/products', {
            plu: testData.plu,
            name: testData.name,
        });
        console.log('Product created:', product.data);

        // 3. Создание остатка
        const stock = await axios.post('http://localhost:3001/stock', {
            plu: testData.plu || 1,
            shop_id: testData.shop_id,
            quantity_on_shelf: testData.quantity_on_shelf,
            quantity_in_order: testData.quantity_in_order,
        });
        console.log('Stock created:', stock.data);

        // 4. Увеличение остатка
        const increasedStock = await axios.put(`http://localhost:3001/stock/increase`, {
            plu: testData.plu,
            shop_id: testData.shop_id,
            quantity_on_shelf: testData.quantity_on_shelf,
            quantity_in_order: testData.quantity_in_order,
        });
        console.log('Stock increased:', increasedStock.data);

        // 5. Уменьшение остатка
        const decreasedStock = await axios.put(`http://localhost:3001/stock/decrease`, {
            plu: testData.plu - 1,
            shop_id: testData.shop_id,
            quantity_on_shelf: testData.quantity_on_shelf,
            quantity_in_order: testData.quantity_in_order,
        });
        console.log('Stock decreased:', decreasedStock.data);

        // 6. Получение истории
        const history = await axios.get('http://localhost:3002/action', {
            params: { shop_id: testData.shop_id, product_id: product.data.id || 1},
        });
        console.log('History fetched:', history.data);
    } catch (err) {
        console.error('Test failed:', err.response ? err.response.data : err.message);
    }
};

testAPI();
