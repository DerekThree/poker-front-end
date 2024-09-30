import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'Poker Odds Calculator';
  response: string = "";
  cards = [
    // replace suit descriptions with their symbols
    { suit: '♠', value: 'A' },
    { suit: '♦', value: '10' },
    { suit: '♣', value: 'K' },
    { suit: '♠', value: 'Q' },
    { suit: '♥', value: 'J' }
  ];

  constructor(private http: HttpClient) {}

  sendRequest() {
    this.http.post('http://localhost:8080/v1/poker/hand', this.cards, { responseType: 'text' })
      .subscribe((res: string) => {
        this.response = res;
        console.log("Response: " + res);
      });
  }


  
}
