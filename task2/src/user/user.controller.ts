import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('resolve-problems')
    async resolveProblems(): Promise<{ count: number }> {
        const count = await this.userService.resolveProblems();
        return { count };
    }
}
