import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CardComponent } from './card/card.component';
// import { CommonModule } from "@angular/common";
// import { FormsModule } from '@angular/forms';
import { LoggerService } from '../service/logger.service';
// import { TopBarComponent } from "../top-bar/top-bar.component";
import { BackgroundService } from '../service/background.service';
// import { AuthService } from '../service/auth/auth.service';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { filter, map, Observable } from 'rxjs';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
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

  // public isAuthenticated$!: Observable<boolean>;
  public name$!: Observable<string>;

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private backgroundService: BackgroundService,
              // private authService: AuthService,
              private _oktaStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth,
              // private _oktaAuthStateService: OktaAuthStateService,
              // private router: Router
            ) {}

  async ngOnInit() {

    this.backgroundService.setActiveBackground();
    // this.isAuthenticated$ = this._oktaAuthStateService.authState$.pipe(
    //   filter((s: AuthState) => !!s),
    //   map((s: AuthState) => s.isAuthenticated ?? false)
    // );

    this.name$ = this._oktaStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims.name ?? '')
    );

    // this.isAuthenticated$.subscribe(async isAuthenticated => {
    //   if (isAuthenticated.valueOf()) {
    //     this.logger.debug("User is authenticated in home page");
    //     const authToken = await this._oktaAuth.tokenManager.get('accessToken');
    //     this.logger.debug("Access token object: ", authToken);
    //   } else {
    //     this.logger.debug("User is not authenticated in home page");
    //   }
    // });

    // const authToken = this._oktaAuth.getAccessToken();
    // this.logger.debug("Access token: " + authToken);
    // this._oktaAuthStateService.authState$.subscribe((authState: AuthState) => { 
    //   this.logger.debug("accessToken: " + authState.accessToken);
    // });
  }

  sendRequest() {
    this.http.post('http://localhost:8080/v1/poker/hand', this.cards, { responseType: 'text' })
      .subscribe((res: string) => {
        this.response = res;
        this.logger.debug("Response: " + res);
      });
  }
}
