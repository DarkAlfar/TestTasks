-- Добавление магазинов
INSERT INTO shops (name, address) VALUES
('Shop A', '123 Main St'),
('Shop B', '456 Elm St'),
('Shop C', '789 Oak St');

-- Добавление товаров
INSERT INTO products (plu, name) VALUES
(4000, 'Product 1'),
(4001, 'Product 2'),
(4002, 'Product 3');

-- Добавление остатков
INSERT INTO stock (product_id, shop_id, shelf, order) VALUES
(1, 1, 50, 10), -- Product 1 в Shop A
(2, 1, 20, 5),  -- Product 2 в Shop A
(1, 2, 30, 8),  -- Product 1 в Shop B
(3, 3, 15, 2);  -- Product 3 в Shop C

-- -- Добавление истории действий
-- INSERT INTO history (action, plu, shop_id, date, details) VALUES
-- ('create_stock', 4000, 1, '2024-11-27 10:00:00', '{"quantity_on_shelf": 50, "quantity_in_order": 10}'),
-- ('create_stock', 4002, 1, '2024-11-27 11:00:00', '{"quantity_on_shelf": 20, "quantity_in_order": 5}'),
-- ('increase_stock', 4000, 1, '2024-11-27 12:00:00', '{"amount": 10}'),
-- ('decrease_stock', 4002, 3, '2024-11-27 13:00:00', '{"amount": 5}');

