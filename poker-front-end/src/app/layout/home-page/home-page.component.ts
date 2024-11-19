import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ CardComponent, CommonModule, FormsModule],
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

  constructor(private http: HttpClient) {}

  sendRequest() {
    this.http.post('http://localhost:8080/v1/poker/hand', this.cards, { responseType: 'text' })
      .subscribe((res: string) => {
        this.response = res;
        console.log("Response: " + res);
      });
  }


  
}
