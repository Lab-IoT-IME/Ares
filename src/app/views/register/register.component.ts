import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  birthday = '';
  phone = '';

  constructor(private auth: AuthService, private router: Router) { }

  signUp() {
    this.auth.signUp(this.name, this.email, this.password, this.birthday, this.phone).then(res => {
      console.log(res);
      this.router.navigate(['login']);
    }).catch(e => {
      console.log(e.error.message);
      this.router.navigate(['register']);
    });
  }
}
