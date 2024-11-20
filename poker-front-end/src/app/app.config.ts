import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-31h2sbyz2b3gdxbf.us.auth0.com',
      clientId: 'KpUR9c1zobOzaoKhUBPF45eoTvPx3YkS',
      authorizationParams: {
        redirect_uri: window.location.origin + "/layout/home"
      }
    }),
  ]
};
