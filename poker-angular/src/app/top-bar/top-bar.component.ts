import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  // standalone: true,
  // imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  
  constructor(public authService: AuthService, private router: Router) {}

  toggleDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent) {
      dropdownContent.classList.toggle('show');
    }
  }

  async logout() {
    this.authService.logout();
    localStorage.setItem('isAuthenticated', 'false');
  }
}
