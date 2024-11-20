import { Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oktaAuth: OktaAuth;

  constructor(private router: Router, private logger: LoggerService) {
    this.oktaAuth = new OktaAuth({
      clientId: 'KpUR9c1zobOzaoKhUBPF45eoTvPx3YkS',
      issuer: 'https://dev-31h2sbyz2b3gdxbf.us.auth0.com/oauth2/default',
      redirectUri: window.location.origin + '/layout/home'
    });
  }

  async login(username: string, password: string) {
    try {
      const transaction = await this.oktaAuth.signInWithCredentials({ username, password });
      if (transaction.status === 'SUCCESS') {
        this.oktaAuth.token.getWithRedirect({
          sessionToken: transaction.sessionToken,
          responseType: ['id_token', 'token']
        });
      } else {
        throw new Error('We cannot handle the ' + transaction.status + ' status');
      }
    } catch (err) {
      this.logger.error(JSON.stringify(err));
    }
  }

  async logout() {
    await this.oktaAuth.signOut();
    this.router.navigate(['/login']);
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.oktaAuth.tokenManager.get('accessToken'));
  }
}