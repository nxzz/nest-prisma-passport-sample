import { AuthGuardPayload } from '../dto/authguard.payload';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private authService: AuthService
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
        const user = await this.authService.validateLocalUser(email, password);
        if (user) {
            return {
                userId: user.id,
                permission: user.permission
            }
        }
        throw new UnauthorizedException();
    }
}