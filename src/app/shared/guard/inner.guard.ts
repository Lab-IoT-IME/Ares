import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InnerGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return new Promise((resolve, reject) => {
        this.authService.isLoggedIn().then(logged => {
          if(logged) this.router.navigate(['dashboard']);
        }).catch(e => console.log(e)).finally(() => resolve(true));
      })
  }
}
