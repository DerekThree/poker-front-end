import { Component } from '@angular/core';
import { TopBarComponent } from "./top-bar/top-bar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TopBarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor() {
  }

  ngOnInit() {
    // this.setBackground(localStorage.getItem('backgroundFileUrl') || '../assets/backgrounds/default.jpg');
  }

  // setBackground(fileUrl: string) {
  //   document.body.style.backgroundImage = `url(${fileUrl})`;
  //   document.body.style.backgroundSize = 'cover';
  //   // document.body.style.backgroundRepeat = 'no-repeat';
  //   document.body.style.backgroundPosition = 'center';
  // }
}
