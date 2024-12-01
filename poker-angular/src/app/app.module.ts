import { NgModule } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CreateAccountPageComponent } from './create-account-page/create-account-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CardComponent } from './home-page/card/card.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';

import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { OktaAuthModule, OKTA_CONFIG, OKTA_AUTH } from '@okta/okta-angular';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CallBackComponent} from './call-back/call-back.component';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-53087663.okta.com/oauth2/default',
  clientId: '0oalbt44hwuhRa12x5d7',
  redirectUri: window.location.origin + '/callback',
  pkce: true,
  scopes: ['openid', 'profile', 'email']
});

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    CreateAccountPageComponent,
    TopBarComponent,
    HomePageComponent,
    SettingsPageComponent,
    CardComponent,
    CallBackComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule.forRoot({ oktaAuth })
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    { provide: OKTA_AUTH, useValue: oktaAuth }],
  bootstrap: [AppComponent]
})
export class AppModule {/*...*/}