import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoggerService } from '../service/logger.service';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrl: './call-back.component.css'
})
export class CallBackComponent implements OnInit {
  constructor(private oktaAuthStateService: OktaAuthStateService,
              private router: Router, 
              @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth,
              private authService: AuthService,
              private logger: LoggerService,
            ) {}

  async ngOnInit() {
    try {
      // Handle the authentication response and set the tokens in the token manager
      this.logger.debug('Handling authentication response...');
      const status = this._oktaAuth.authn.status;
      this.logger.debug('status: ', status);

      const code = window.location.toString().split('code=')[1].split('&')[0];
      this.logger.debug('code: ', code);
      const tokens = await this._oktaAuth.token.exchangeCodeForTokens({
        authorizationCode: code,
        codeVerifier: localStorage.getItem('codeVerifier') || undefined,
      });
      this.logger.debug('tokens: ', tokens);
      this._oktaAuth.tokenManager.setTokens(tokens.tokens);

      this._oktaAuth.isAuthenticated().then((isAuthenticated) => {
        if (isAuthenticated) {
          console.log('isAuthenticated from Google');
          const authToken = this._oktaAuth.tokenManager.getTokens().then((tokens) => {
            const name = tokens.idToken?.claims.name;
            const firstName = name ? name.split(' ')[0] : '';
            const lastName = name ? name.split(' ')[1] : '';
            const email = tokens.idToken?.claims.email;
            const username = email ? email : '';
            this.authService.registerWithIdp(firstName, lastName, username);
          });
          this.logger.debug("Access token: ", authToken);
        }
        else {
          console.log('is Not Authenticated from Google');
        }
      });

      // Redirect to the home page
      this.router.navigate(['/home']);
    } catch (err) {
      this.logger.error('Error handling authentication response', err);
      this.router.navigate(['/login']);
    }
  }
}
