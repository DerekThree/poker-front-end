import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoggerService } from '../service/logger.service';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrl: './call-back.component.css'
})
export class CallBackComponent implements OnInit {
  constructor(private oktaAuthStateService: OktaAuthStateService,
              private router: Router, 
              @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth,
              private logger: LoggerService,
            ) {}

  async ngOnInit() {
    try {
      // Handle the authentication response and set the tokens in the token manager
      this.logger.debug('Handling authentication response...');
      const status = await this._oktaAuth.authn.status;//.token.parseFromUrl();
      this.logger.debug('status: ', status);

      this.logger.debug('window.location.search: ', window.location.toString());
      const code = window.location.toString().split('code=')[1].split('&')[0];
      this.logger.debug('code: ', code);
      const tokens = await this._oktaAuth.token.exchangeCodeForTokens({
        authorizationCode: code,
        codeVerifier: localStorage.getItem('codeVerifier') || undefined,
      });
      this._oktaAuth.tokenManager.setTokens(tokens.tokens);
      this.logger.debug('tokens: ', tokens);
      this._oktaAuth.tokenManager.setTokens(tokens.tokens);

      // Redirect to the home page
      this.router.navigate(['/home']);
    } catch (err) {
      this.logger.error('Error handling authentication response', err);
      this.router.navigate(['/login']);
    }
  }
}
