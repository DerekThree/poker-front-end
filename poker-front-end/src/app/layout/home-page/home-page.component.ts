import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../service/logger.service';
import { TopBarComponent } from "../top-bar/top-bar.component";
import { BackgroundService } from '../../service/background.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ CardComponent, CommonModule, FormsModule, TopBarComponent ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  title = 'Pick Your Cards';
  response: string = "";
  cards = [
    { suit: '♠', value: 'A' },
    { suit: '♦', value: '10' },
    { suit: '♣', value: 'K' },
    { suit: '♠', value: 'Q' },
    { suit: '♥', value: 'J' }
  ];

  suits = ['♥', '♠', '♦', '♣'];
  values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private backgroundService: BackgroundService,
              private authService: AuthService) {}

  async ngOnInit() {
    this.backgroundService.setBackground();
    await this.authService.handleAuthentication();
  }

  sendRequest() {
    this.http.post('http://localhost:8080/v1/poker/hand', this.cards, { responseType: 'text' })
      .subscribe((res: string) => {
        this.response = res;
        this.logger.debug("Response: " + res);
      });
  }

  
}
