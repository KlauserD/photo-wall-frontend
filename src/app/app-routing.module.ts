import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { AuthConfirmComponent } from './auth-confirm/auth-confirm.component';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { IsUnauthenticatedGuard } from './is-unauthenticated.guard';

const routes: Routes = [
  {
   path: '',
   component: MainComponent,
   canActivate: [IsAuthenticatedGuard]
  },
  {
   path: 'auth',
   component: AuthComponent,
   canActivate: [IsUnauthenticatedGuard]
  },
    {
   path: 'auth-confirm/:token',
   component: AuthConfirmComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
