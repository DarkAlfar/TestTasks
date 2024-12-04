import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createRandomUsers(count: number): Promise<void> {
        const batchSize = 10000; // Разделение на батчи по 10 000
        const users: User[] = [];

        for (let i = 0; i < count; i++) {
            users.push(
                this.userRepository.create({
                    firstName: `User${i}`,
                    lastName: `LastName${i}`,
                    age: Math.floor(Math.random() * 80) + 18,
                    gender: Math.random() > 0.5 ? 'Male' : 'Female',
                    hasProblems: Math.random() > 0.5,
                }),
            );

            if (users.length === batchSize) {
                await this.userRepository.save(users); // Сохраняем текущий батч
                users.length = 0; // Очищаем массив
            }
        }

        // Сохранение оставшихся пользователей
        if (users.length > 0) {
            await this.userRepository.save(users);
        }

        console.log(`Successfully seeded ${count} users`);
    }
    async resolveProblems(): Promise<number> {
        const count = await this.userRepository.count({ where: { hasProblems: true } });
        await this.userRepository.update({ hasProblems: true }, { hasProblems: false });
        return count;
    }
    async getProblems(): Promise<User[]> {
        return this.userRepository.find({ where: { hasProblems: true } });
    }
}
