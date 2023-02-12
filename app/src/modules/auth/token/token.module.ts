import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserRepository } from 'src/modules/prisma/repository/user.repository';
import { TokenAuthController } from './token.controller';
import { TokenAuthService } from './token.service';
import { UserRefreshTokenRepository } from 'src/modules/prisma/repository/user-refresh-token.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_KEY,
            signOptions: { expiresIn: `${process.env.ACCESS_TOKEN_LIFESPAN}s` },
        }),
    ],
    controllers: [TokenAuthController],
    providers: [
        UserRepository,
        UserRefreshTokenRepository,
        TokenAuthService,
    ],
    exports: [
        JwtModule,
        TokenAuthService
    ]
})
export class TokenAuthModule { }
