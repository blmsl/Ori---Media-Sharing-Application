import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MediaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaProvider {

  baseUrl = 'http://media.mw.metropolia.fi/wbma/';
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';


  constructor(public http: HttpClient) {
    console.log('Hello MediaProvider Provider');
  }

  getAllMedia() {
    return this.http.get(this.baseUrl + 'media');
  }

  getMediaById(id) {
    return this.http.get(this.baseUrl + 'media/' + id);
  }

  getUserInfo(userId, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token)
    };
    return this.http.get(this.baseUrl + 'users/' + userId, settings);
  }

}
