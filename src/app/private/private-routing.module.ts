import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authorizationGuard } from '../iam/guards/authorization.guard';

const routes: Routes = [
  {
      path: 'users',
      loadChildren: () =>
        import('./users/users.module').then((m) => m.UsersModule),
      canActivate: [authorizationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
