import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoComponent } from './components/demo/demo.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  },

];

@NgModule({
  declarations: [
    LoginComponent,
    DemoComponent
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
