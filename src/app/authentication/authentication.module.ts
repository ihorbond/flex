import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'demo',
    component: SplashScreenComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  },

];

@NgModule({
  declarations: [
    LoginComponent,
    SplashScreenComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthenticationModule { }
