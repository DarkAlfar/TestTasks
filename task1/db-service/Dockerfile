# Используем официальный образ PostgreSQL
FROM postgres:15

# Копируем скрипты инициализации
COPY create_tables.sql /docker-entrypoint-initdb.d/
COPY insert_test.sql /docker-entrypoint-initdb.d/

# Устанавливаем переменные окружения
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=inventory
