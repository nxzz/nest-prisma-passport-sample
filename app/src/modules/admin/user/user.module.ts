import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { UserRepository } from 'src/modules/prisma/repository/user.repository';
import { UserAdminController } from './user.controller';
import { UserAdminService } from './user.service';

@Module({
    imports: [
        PrismaModule,
        UserAdminModule
    ],
    controllers: [UserAdminController],
    providers: [
        UserAdminService,
        UserRepository,
    ],
})
export class UserAdminModule { }
