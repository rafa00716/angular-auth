import { Routes } from '@angular/router';
import { authenticationGuard } from './iam/guards/authentication.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
          import('./public/public.module').then((m) => m.PublicModule),
    },
    {
        path: 'auth',
        loadChildren: () =>
          import('./iam/iam.module').then((m) => m.IamModule),
    },
    {
        path: 'app',
        loadChildren: () =>
          import('./private/private.module').then((m) => m.PrivateModule),
        canActivate: [authenticationGuard]
    },
];
