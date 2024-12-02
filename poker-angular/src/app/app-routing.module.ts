import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CreateAccountPageComponent } from './create-account-page/create-account-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { CallBackComponent} from './call-back/call-back.component';
import { authGuard } from './service/auth/auth.guard'; // Adjust the path as necessary

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [authGuard]  },
  { path: 'login', component: LoginPageComponent },
  { path: 'create-account', component: CreateAccountPageComponent },
  { path: 'callback', component: CallBackComponent },
  { path: 'settings', component: SettingsPageComponent, canActivate: [authGuard]  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
