import { PrismaModule } from './../../prisma/prisma.module';
import { Logger, Module } from '@nestjs/common';
import { UserAuthController } from './user.controller';
import { UserAuthService } from './user.service';
import { TokenAuthModule } from '../token/token.module';

@Module({
    imports: [
        PrismaModule,
        TokenAuthModule,
    ],
    controllers: [UserAuthController],
    providers: [
        UserAuthService,
    ],
    exports: [
        UserAuthService,
    ]
})
export class UserAuthModule { }
