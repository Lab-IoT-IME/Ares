import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.auth.signOut().then(path => {
      this.router.navigate([path]);
    }).catch(e => console.log(e));
  }
}
