import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class UserService {
  baseUrl = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) {}

  get userInfo() {
    return JSON.parse(localStorage.getItem('user'));
  }

  updateUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}