# Указываем базовый образ
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем остальные файлы
COPY . .

# Указываем порт и команду для запуска
EXPOSE 3002
CMD ["npm", "start"]
