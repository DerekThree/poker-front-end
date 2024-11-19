import { Component } from '@angular/core';
import { TopBarComponent } from "./top-bar/top-bar.component";
import { RouterModule } from '@angular/router';
import { BackgroundService } from '../service/background.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TopBarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private backgroundService: BackgroundService) {}

  ngOnInit() {
    this.backgroundService.setBackground();
  }

}
