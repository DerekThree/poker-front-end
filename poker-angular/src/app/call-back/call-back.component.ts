import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrl: './call-back.component.css'
})
export class CallBackComponent implements OnInit {
  constructor(private oktaAuthStateService: OktaAuthStateService, private router: Router, private _oktaAuth: OktaAuth) {}

  async ngOnInit() {
    try {
      // Handle the authentication response and set the tokens in the token manager
      console.log('Handling authentication response...');
      const tokens = await this._oktaAuth.token.parseFromUrl();
      this._oktaAuth.tokenManager.setTokens(tokens.tokens);

      // Redirect to the home page
      // this.router.navigate(['/home']);
    } catch (err) {
      console.error('Error handling authentication response', err);
      this.router.navigate(['/login']);
    }
  }
}
