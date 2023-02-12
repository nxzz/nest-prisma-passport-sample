import { AuthGuardPayload } from '../dto/authguard.payload';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/modules/prisma/repository/user.repository';
import { compare } from 'bcrypt';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private userRepository: UserRepository,
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<AuthGuardPayload> {
        if (!email || !password) {
            throw new UnauthorizedException();
        }
        const user = await this.userRepository.findFirst({
            where: {
                email: email
            }
        });
        if (user && await compare(password, user.password)) {
            return {
                userId: user.id,
                permission: user.permission
            }
        }
        throw new UnauthorizedException();
    }
}