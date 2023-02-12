import { UserRepository } from './../../prisma/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UserAuthService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async signup(name: string, email: string, password: string) {
        return await this.userRepository.create({
            data: {
                name: name,
                email: email,
                password: await hash(password, 10),
                permission: Permission.ENDUSER
            },
        });
    }

    async destroy(userId: number) {
        await this.userRepository.delete({
            where: {
                id: userId
            }
        });
    }
}
