import { UserAdminModule } from './user/user.module';

import { Routes } from 'nest-router';

export const AdminRoutes: Routes = [
    {
        path: 'user',
        module: UserAdminModule
    },
];
