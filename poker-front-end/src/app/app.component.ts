import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from "./layout/top-bar/top-bar.component";
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  // constructor(public auth: AuthService) {}
  constructor() {}


  // constructor() {
  //   this.setBackground(localStorage.getItem('backgroundFileUrl') || './assets/backgrounds/default.jpg');
  // }

  // setBackground(fileUrl: string) {
  //   document.body.style.backgroundImage = `url(${fileUrl})`;
  //   document.body.style.backgroundSize = 'cover';
  //   // document.body.style.backgroundRepeat = 'no-repeat';
  //   document.body.style.backgroundPosition = 'center';
  // }
}
