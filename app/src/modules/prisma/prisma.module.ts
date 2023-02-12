import { Module, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRefreshTokenRepository } from './repository/user-refresh-token.repository';
import { UserRepository } from './repository/user.repository';

@Module({
    imports: [],
    controllers: [],
    providers: [
        Logger,
        PrismaService,
        UserRepository,
        UserRefreshTokenRepository,
    ],
    exports: [
        Logger,
        PrismaService,
        UserRepository,
        UserRefreshTokenRepository,
    ],
})
export class PrismaModule { }
