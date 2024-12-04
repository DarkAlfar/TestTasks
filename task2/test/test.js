// import pool from './src/db.js';
const axios = require('axios');

// async function userGeneration() {
//     await pool.query(`
//         CREATE TABLE IF NOT EXISTS users (
//             id SERIAL PRIMARY KEY,
//             first_name VARCHAR(100),
//             last_name VARCHAR(100),
//             age INT,
//             gender VARCHAR(10),
//             has_problems BOOLEAN
//         );
//     `);
//
//     console.log('Начинается генерация пользователей...');
//     const values = [];
//     for (let i = 0; i < 1000000; i++) {
//         values.push(`('Имя${i}', 'Фамилия${i}', ${Math.floor(Math.random() * 80 + 20)}, '${Math.random() > 0.5 ? 'male' : 'female'}', ${Math.random() > 0.5})`);
//     }
//     await pool.query(`
//         INSERT INTO users (first_name, last_name, age, gender, has_problems)
//         VALUES ${values.join(',')}
//     `);
//     console.log('Генерация завершена.');
//     process.exit();
// }
//
// userGeneration().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });

// тест для проверки работы
axios.post('http://localhost:3000/user/resolve-problems')
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error(error);
    });

