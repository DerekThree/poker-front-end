import { Routes } from '@angular/router';
import { HomePageComponent } from './layout/home-page/home-page.component';
import { SettingsPageComponent } from './layout/settings-page/settings-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LayoutComponent } from './layout/layout.component';
import { CreateAccountPageComponent } from './create-account-page/create-account-page.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'create-account', component: CreateAccountPageComponent },
  { path: 'layout', component: LayoutComponent, children: [
      { path: 'home', component: HomePageComponent }, 
      { path: 'settings', component: SettingsPageComponent },
    ]
  }, 
  { path: '**', redirectTo: 'login' }
];
