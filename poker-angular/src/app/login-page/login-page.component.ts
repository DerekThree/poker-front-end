import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundService } from '../service/background.service';
import { AuthService } from '../service/auth.service';
import { LoggerService } from '../service/logger.service';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { filter, map, Observable } from 'rxjs';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
@Component({
  selector: 'app-login-page',
  // standalone: true,
  // imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  title = 'Poker Odds Calculator';
  username: string = '';
  password: string = '';

  public isAuthenticated$!: Observable<boolean>;

  constructor(private _authService: AuthService,
              private logger: LoggerService,
              private backgroundService: BackgroundService,
              private authService: AuthService,
              private _oktaStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth,
              private _oktaAuthStateService: OktaAuthStateService,
              private router: Router) {}

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../assets/backgrounds/default.jpg)';

    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );

    this.isAuthenticated$.subscribe(async isAuthenticated => {
      if (isAuthenticated.valueOf()) {
        this.logger.debug("User is authenticated in login page");
        const authToken = await this._oktaAuth.tokenManager.get('accessToken');
        this.logger.debug("Access token: ", authToken);
      } else {
        this.logger.debug("User is not authenticated in login page");
        // this.router.navigate(['/login']);
      }
    });
  }

  async onSubmit() {
    this.logger.debug('Username: ' + this.username);
    await this._authService.loginWithCredentials(this.username, this.password);
    localStorage.setItem('isAuthenticated', 'true');
    // this.router.navigate(['/home']);
  }

  // async logout() {
  //   await this._authService.logout();
  //   this.logger.info('Logged out');
  // }

  async loginWithGoogle() {
    await this._authService.LoginWithGoogle();
    localStorage.setItem('isAuthenticated', 'true');
  }
}
