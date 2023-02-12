import { TokenAuthModule } from './token/token.module';
import { UserAuthModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
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
    providers: [
        UserRefreshTokenRepository,
        RefreshTokenStrategy,
        LocalStrategy,
        JwtStrategy,
        JwtAdminStrategy,
    ],
})
export class AuthModule { }
