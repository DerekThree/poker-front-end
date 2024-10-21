import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  
  toggleDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent) {
      dropdownContent.classList.toggle('show');
    }
  }
}
