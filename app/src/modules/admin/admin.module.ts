import { UserAdminModule } from './user/user.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        UserAdminModule,
    ],
    controllers: [],
    providers: [],
})
export class AdminModule { }
