import { TokenAuthModule } from './token/token.module';
import { AuthModule } from './auth.module';
import { Routes } from 'nest-router';
import { UserAuthModule } from './user/user.module';

export const AuthRoutes: Routes = [
    {
        path: '/',
        module: AuthModule
    },
    {
        path: '/user',
        module: UserAuthModule
    },
    {
        path: '/token',
        module: TokenAuthModule
    }
];
