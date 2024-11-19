import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundService } from '../service/background.service';

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

  constructor(private router: Router, private backgroundService: BackgroundService) {}

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/backgrounds/default.jpg)';
  }

  onSubmit() {
    console.log('Username: ' + this.username);
    console.log('Password: ' + this.password);
    this.router.navigate(['/layout/home']);
  }
}
