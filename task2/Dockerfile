# Указываем базовый образ
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Компилируем TypeScript-код в JavaScript
RUN npm run build

# Указываем порт для приложения
EXPOSE 3000

# Указываем команду для запуска приложения
CMD ["npm", "run", "start:prod"]
