import { TokenAuthModule } from './token/token.module';
import { UserAuthModule } from './user/user.module';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRefreshTokenRepository } from '../prisma/repository/user-refresh-token.repository';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { JwtStrategy, JwtAdminStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        UserAuthModule,
        TokenAuthModule,
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        UserRefreshTokenRepository,
        RefreshTokenStrategy,
        LocalStrategy,
        JwtStrategy,
        JwtAdminStrategy,
        AuthService
    ],
    exports: [
        AuthService
    ],
})
export class AuthModule { }
