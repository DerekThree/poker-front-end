import { Inject, Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { LoggerService } from '../logger.service';
import { IdxStatus } from '@okta/okta-auth-js';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OKTA_AUTH } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';

  constructor(private logger: LoggerService,
              private http: HttpClient,
              @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth,
              private router: Router) {}
  
  async loginWithCredentials(username: string, password: string) {
    try {
      this.logger.debug('Logging in with credentials');
      const transaction = await this._oktaAuth.signInWithCredentials({ username, password });
      this.logger.debug('Transaction: ', transaction);
      if (transaction.status === 'SUCCESS') {

        const authorizeRes = this._oktaAuth.token.getWithoutPrompt({
          sessionToken: transaction.sessionToken,
          responseType: ['id_token', 'token'],
          state: 'TEST',
          nonce: 'TEST',
          scopes: ['openid', 'profile' ],
        }).then((res) => {
          this.logger.debug('AuthService received acces token: ', res.tokens.accessToken);
          this.logger.debug('AuthService received id token: ', res.tokens.idToken);
          this._oktaAuth.tokenManager.setTokens(res.tokens);
          this.router.navigate(['/home']);
        })
        
      } else {
        throw new Error('We cannot handle the ' + transaction.status + ' status');
      }
    } catch (err) {
      this.logger.error(JSON.stringify(err));
    }
  }

  async LoginWithGoogle() {
    try {
      this.logger.debug('Logging in with Google');
      const codeVerifier = this._oktaAuth.pkce.generateVerifier('prefix');
      localStorage.setItem('codeVerifier', codeVerifier);
      const codeChallenge = await this._oktaAuth.pkce.computeChallenge(codeVerifier);
      
      // Redirect to Callback component
      await this._oktaAuth.signInWithRedirect({
        responseType: 'code',
        codeChallenge: codeChallenge,
        codeVerifier: codeVerifier,
        codeChallengeMethod: 'S256',
        responseMode: 'fragment',
        state: 'TEST',
        nonce: 'TEST',
        scopes: [ 'openid', 'profile' ],
        idp: '0oald4vpnbe1z2mVY5d7', // Google
      });
      
    } catch (err) {
      this.logger.error(JSON.stringify(err));
    }
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
    
    const headers = new HttpHeaders({
      'X-Username': username
    });

    try {
      const response = await this.http.post(this.baseUrl + '/v1/user/register', body, { headers }).toPromise();
      this.loginWithCredentials(username, password);
      this.logger.info('User created and activated successfully:', response);
    } catch (error) {}
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
    } catch (error) {}
  }

  // async handleAuthentication() {
  //   const tokens = await this._oktaAuth.token.parseFromUrl();
  //   this._oktaAuth.tokenManager.setTokens({
  //     accessToken: tokens.tokens.accessToken,
  //     idToken: tokens.tokens.idToken,
  //   });
  // }
  
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this._oktaAuth.tokenManager.get('accessToken');
    const idToken = await this._oktaAuth.tokenManager.get('idToken');
    return !!(accessToken && idToken);
  }

  async logout() {
    this.logger.debug('Logging out');
    await this._oktaAuth.signOut({
      postLogoutRedirectUri: window.location.origin + '/login'
    });
    this._oktaAuth.tokenManager.clear(); 
    sessionStorage.clear(); 
  }
}