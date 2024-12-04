import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'users_db',
      autoLoadEntities: true,
      synchronize: true, // отключить в проде
    }),
    UserModule,
  ],
})
export class AppModule {}
