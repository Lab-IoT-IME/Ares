import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent { 
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.signIn(this.email, this.password).then(res => {
      this.router.navigate(['']);
    }).catch(e => console.log(e));
  }

  goToRegister() {
    this.router.navigate(['register']);
  }
}
