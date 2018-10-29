import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ErrorLoginComponent } from './error-login/error-login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'error-login',
        component: ErrorLoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '**',
        redirectTo:'login'
    }
];


@NgModule({
  imports: [
      CommonModule,
      RouterModule.forRoot(routes, {
          useHash: false,
          enableTracing:true
      })
  ],
    declarations: [
    ],
  exports: [RouterModule]
})
export class AppRouteModule { }