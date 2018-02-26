import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MediaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaProvider {

  reload: boolean = false;

  baseUrl = 'http://media.mw.metropolia.fi/wbma/';
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';


  constructor(public http: HttpClient) {
  }

  postTag(tag) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token')),
    };
    return this.http.post(this.baseUrl + 'tags', tag, settings);
  }

  uploadFile(media) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token')),
    };
    return this.http.post(this.baseUrl + 'media', media, settings);
  }

  postLike(like) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token')),
    };
    return this.http.post('http://media.mw.metropolia.fi/wbma/favourites', like, settings);
  }

  deleteLike(id) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token')),
    };
    return this.http.delete('http://media.mw.metropolia.fi/wbma/favourites/file/' + id, settings);
  }

  postComment(comment) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token')),
    };
    return this.http.post('http://media.mw.metropolia.fi/wbma/comments', comment, settings);
  }

  deleteComment(commentId){
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token')),
    };
    return this.http.delete('http://media.mw.metropolia.fi/wbma/comments/' + commentId, settings);
  }

  getAllMedia(end) {
    return this.http.get(this.baseUrl + 'media?start=0&limit='+ end);
  }

  getMediaById(id) {
    return this.http.get(this.baseUrl + 'media/' + id);
  }

  deleteMedia(fileId) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };
    return this.http.delete(this.baseUrl + 'media/' + fileId, settings)
  }

  getComment(fileId) {
    return this.http.get(this.baseUrl + 'comments/file/' + fileId);
  }

  getLike(fileId) {
    return this.http.get(this.baseUrl + 'favourites/file/' + fileId);
  }

}
