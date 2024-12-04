-- Таблица магазинов
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255)
);

-- Таблица товаров
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    plu INT NOT NULL UNIQUE, -- Уникальный код товара
    name VARCHAR(255) NOT NULL
);

-- Таблица остатков
CREATE TABLE stock (
    id SERIAL PRIMARY KEY, -- Уникальный идентификатор остатка
    product_id INT NOT NULL, -- Внешний ключ на таблицу товаров
    shop_id INT NOT NULL, -- Внешний ключ на таблицу магазинов
    quantity_on_shelf INT NOT NULL DEFAULT 0, -- Количество товара на полке
    quantity_in_order INT NOT NULL DEFAULT 0, -- Количество товара в заказе
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE
);

-- -- Таблица истории действий
-- CREATE TABLE history (
--     id SERIAL PRIMARY KEY, -- Уникальный идентификатор записи
--     action VARCHAR(50) NOT NULL, -- Действие (например, create_stock, increase_stock, etc.)
--     plu INT NOT NULL, -- Код товара
--     shop_id INT NOT NULL, -- Идентификатор магазина
--     date TIMESTAMP NOT NULL DEFAULT NOW(), -- Дата и время действия
--     details JSONB -- Дополнительная информация о действии в формате JSON
-- );
