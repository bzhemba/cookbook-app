import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @ApiProperty({ example: 'user123', description: 'Имя пользователя' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
    password: string;

    @ApiProperty({ example: 'example@example.com', description: 'Почта пользователя' })
    email: string;
}