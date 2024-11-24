import { Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';
import { IdxStatus } from '@okta/okta-auth-js';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oktaAuth: OktaAuth;
  private baseUrl = 'http://localhost:8080';

  constructor(private router: Router, private logger: LoggerService, private http: HttpClient) {
    this.oktaAuth = new OktaAuth({
      // clientId: 'KpUR9c1zobOzaoKhUBPF45eoTvPx3YkS',
      // issuer: 'https://dev-31h2sbyz2b3gdxbf.us.auth0.com',
      clientId: '0oalbt44hwuhRa12x5d7',
      issuer: 'https://dev-53087663.okta.com',
      // clientId: '0oalckemycVSaU5MW5d7',
      // issuer: 'https://dev-81750295.okta.com',
      redirectUri: 'https://localhost:4200'
      ,
      pkce: true
    });
  }
  
  async loginWithCredentials(username: string, password: string) {
    try {
      const transaction = await this.oktaAuth.signInWithCredentials({ username, password });
      this.logger.debug('Transaction: ', transaction);
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

  async LoginWithGoogle() {
    try {
      await this.oktaAuth.signInWithRedirect({
        responseType: ['code'],
        scopes: ['openid', 'profile', 'email'],
        idp: '0oald4vpnbe1z2mVY5d7' // Google
      });
    } catch (err) {
      this.logger.error(JSON.stringify(err));
    }
  }

  async logout() {
    await this.oktaAuth.signOut({
      postLogoutRedirectUri: window.location.origin + '/login'
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.oktaAuth.tokenManager.get('accessToken'));
  }

  async registerWithCredentials(firstName: string, lastName: string, username: string, password: string ) {
    const body = {
      profile: {
        firstName: firstName,
        lastName: lastName,
        email: username,
        login: username
      },
      credentials: {
        password: { value: password }
      }
    };
    
    try {
      const response = await this.http.post(this.baseUrl + '/v1/user/register', body).toPromise();
      // const response = await this.http.post(url, body, { headers }).toPromise();
      // this.oktaAuth.idx.register(body);
      this.loginWithCredentials(username, password);
      this.logger.info('User created and activated successfully:', response);
    } catch (error) {
      this.logger.error('Error creating user:', error);
      const response = error as HttpErrorResponse;
      alert('Error creating user: ' + response.error);
    }
  }

  async registerWithIdp(firstName: string, lastName: string, username: string) {
    const body = {
      profile: {
        firstName: firstName,
        lastName: lastName,
        email: username,
        login: username
      }
    };
    
    try {
      const response = await this.http.post(this.baseUrl + '/v1/user/register', body).toPromise();
      this.logger.info('User created and activated successfully:', response);
    } catch (error) {
      this.logger.error('Error creating user:', error);
      const response = error as HttpErrorResponse;
      alert('Error creating user: ' + response.error);
    }
  }

  async handleAuthentication() {
    const tokens = await this.oktaAuth.token.parseFromUrl();
    this.oktaAuth.tokenManager.setTokens({
      accessToken: tokens.tokens.accessToken,
      idToken: tokens.tokens.idToken,
      refreshToken: tokens.tokens.refreshToken
    });
  }

  async getUsername(): Promise<string | null> {
    try {
      const user = await this.oktaAuth.getUser();
      this.logger.info('User: ', user);
      return user ? String(user.email || user.preferred_username || user['login']) : null;
    } catch (err) {
      this.logger.error('Error getting user info:', err);
      return null;
    }
  }
}