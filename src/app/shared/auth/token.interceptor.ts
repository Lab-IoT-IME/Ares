import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { from, Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}

  authPath = new RegExp(`${environment.apiBaseUrl}\/auth\/*`, "g");

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authPath.test(request.url)) {
      return next.handle(request);
    }
    return from(this.handleToken(request, next));
  }

  private async handleToken(request: HttpRequest<any>, next: HttpHandler) {
    await this.auth
      .getToken()
      .then((token) => {
        request = request.clone({
          setHeaders: {
            Token: token.toString(),
          },
        });
      })
      .catch((e) => console.log(e.error.message));
    return next.handle(request).toPromise();
  }
}
