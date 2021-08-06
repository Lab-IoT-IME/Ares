import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  baseUrl = environment.apiBaseUrl;
  hourMs = 3600000;

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private userService: UserService) { }

  signUp(name: string, email: string, password: string, birthday: string, phone: string) {
    return new Promise((resolve, reject) => {
      var user = {
        'name': name,
        'birthday': birthday,
        'phone': phone,
        'email': email,
        'password': password,
        'typeId': "1"
      }
      this.http.post(`${this.baseUrl}/users/`, user).toPromise()
        .then(res => resolve(res))
        .catch(e => reject(e))
    })
  }

  signIn(email: string, password: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders()
        .set('Authorization', `Basic ${btoa(email+':'+password)}`)
        .set('Content-Type', 'application/json'); 
      this.http.post(`${this.baseUrl}/auth/`, {}, {headers: headers}).toPromise()
        .then(res => {
          this.setAuthCredentials(res);
          resolve(200);
        }).catch(e => reject(e));
    });
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'); 
      let refToken = this.cookieService.get('refresh');
      this.http.post(`${this.baseUrl}/auth/refresh`, {token: refToken}, {headers: headers})
        .toPromise()
        .then(res => {
          this.setAuthCredentials(res);
          resolve(res['token']);
        }).catch(e => reject(e));
    });
  }

  setAuthCredentials(res) {
    this.cookieService.set('token', res['token'], new Date(Date.now() + 4*this.hourMs));
    this.cookieService.set('refresh', res['refresh'], new Date(Date.now() + this.hourMs * 24));
    this.userService.updateUser(res['user'])
  }

  signOut() {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem('user');
        this.cookieService.delete('token');
        this.cookieService.delete('refresh');
        resolve('login');
      }catch(e){
        reject(e);
      }
    })
  }


  getToken() {
    return new Promise((resolve, reject) => {
      let token = this.cookieService.get('token');
  
      if(token != '') resolve(token);
       
      this.refreshToken().then(res => {
        token = res.toString();
        resolve(token);
      }).catch(e => reject(e));
    });
  }

  public async isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.getToken().then(token => {
      if(token == null || user == null) return false;
      return true;
    }).catch(e => {
      console.log(e.error.message);
      return false;
    })
  }
}