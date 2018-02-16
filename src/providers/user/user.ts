import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class UserProvider {

  logged = false;
  baseUrl = 'http://media.mw.metropolia.fi/wbma/';

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  getUserData(token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
    };
    return this.http.get(this.baseUrl + 'users/user', settings);
  }

  register(user) {  
      return this.http.post(this.baseUrl + 'users', user);
    }
   

  login(user) {
    // optional
    const settings = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };
   
      return this.http.post(this.baseUrl + 'login', user, settings);
    }

}
