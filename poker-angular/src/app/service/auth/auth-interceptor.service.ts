import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private _oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from tokenManager
    return from(this._oktaAuth.tokenManager.getTokens()).pipe(
      switchMap(tokens => {
        const accessToken = tokens.accessToken ? tokens.accessToken.accessToken : null;
        const username = tokens.idToken ? tokens.idToken.claims.preferred_username : null;
        const isAdmin = tokens.accessToken && Array.isArray(tokens.accessToken.claims['groups']) ?
                        tokens.accessToken.claims['groups'].includes('Poker Admins') : false;

        // Clone the request and add the headers
        if (req.method == 'POST' && accessToken && username) {
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
              'X-Username': username,
              'X-Is-Admin': isAdmin.toString()
            }
          });
          return next.handle(clonedReq);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}