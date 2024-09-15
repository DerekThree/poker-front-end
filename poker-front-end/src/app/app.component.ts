import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'poker-front-end';
  response: string = "";

  constructor(private http: HttpClient) {}

  sendRequest() {
    this.http.get('http://localhost:8080/v1/poker/health', { responseType: 'text' }).subscribe((res: string) => {
      this.response = res;
    });
  }


  

  
}
