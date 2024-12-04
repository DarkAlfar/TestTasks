import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);

  // Генерация данных
  const shouldSeed = process.env.SEED_USERS === 'true'; // Управление через переменные окружения
  if (shouldSeed) {
    await userService.createRandomUsers(1000000); // Генерация 1 млн пользователей
  }

  await app.listen(3000);
}
bootstrap();
