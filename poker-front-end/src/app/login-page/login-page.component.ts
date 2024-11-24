import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundService } from '../service/background.service';
import { AuthService } from '../service/auth.service';
import { LoggerService } from '../service/logger.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  title = 'Poker Odds Calculator';
  username: string = '';
  password: string = '';

  constructor(public authService: AuthService, private router: Router, private backgroundService: BackgroundService, private logger: LoggerService) {}

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/backgrounds/default.jpg)';
  }

  async onSubmit() {
    this.logger.debug('Username: ' + this.username);
    await this.authService.loginWithCredentials(this.username, this.password);
  }

  async logout() {
    await this.authService.logout();
    this.logger.info('Logged out');
  }

  async loginWithGoogle() {
    await this.authService.LoginWithGoogle();
  }
}
