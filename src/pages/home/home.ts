import { OtherProfilePage } from './../other-profile/other-profile';
import { ProfilePage } from './../profile/profile';
import { DetailMediaPage } from './../detail-media/detail-media';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProvider } from './../../providers/user/user';
import { MediaProvider } from './../../providers/media/media';
import { Component, ViewChild } from '@angular/core';
import { InfiniteScroll, NavController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { Search } from '../../app/models/search';
import { SearchPage } from '../search/search';
import { Refresher } from 'ionic-angular/components/refresher/refresher';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  medias: any = [];
  arr: any = [];
  searchArray: any = []; 
  numberOfComment: any;
  numberOfLike: any;  
  mediaArray: any;
  currentUser_id;
  end: number = 5;
  toggled: boolean = false;
  search: Search = {title: ''};
  showPopular = false;


  constructor(public navCtrl: NavController,
    private mediaProvider: MediaProvider,
    private userProvider: UserProvider) {

  }

  ionViewDidLoad() {
    if (localStorage.getItem('token') !== null) {
      this.userProvider.getUserData(localStorage.getItem('token')).
        subscribe(response => {
          this.currentUser_id = response['user_id'];
          this.userProvider.logged = true;
          localStorage.setItem('user', JSON.stringify(response));
        }, (error: HttpErrorResponse) => {
          console.log(error);
        });
    }
    this.getAllMedia(null);
  }

  ionViewWillEnter() {
    if(this.mediaProvider.reload){
      this.medias = [];
      this.end = 5;
      this.getAllMedia(null);
      this.mediaProvider.reload = false;
    }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
  getAllMedia(callbacks: any) {
    this.mediaProvider.getAllMedia(this.end).subscribe((data: any) => {
      console.log("getAllMedia data received.");
      let likesCallback = null;
      let commentCallback = null;
      let mediaCallback = null;      
      this.medias = data;

      console.log(this.medias);
      // Check callback to see if the call function is done or not
      if (callbacks != null) {
        if (typeof callbacks == 'object') {          
          if (callbacks.likes) {likesCallback = callbacks.likes;}
          if (callbacks.media) {mediaCallback = callbacks.media;}
          this.showPopular = true;
        }
      }            

      this.getNumberOfComment();      
      this.getNumberOfLike(likesCallback, this.medias);
      
      if (mediaCallback != null) {mediaCallback(this.medias);}

      for (let user of this.medias) {
        this.userProvider.getAllUserInfo(user.user_id).subscribe(res => {
          this.mediaArray = res;
          for (let i in this.medias) {
            if (this.medias[i].user_id == res['user_id']) {
              this.medias[i].username = res['username'];
            }           
          }         
        })
      }      
    });
  }

  getNumberOfComment() {
    for (let file of this.medias) {
      this.mediaProvider.getComment(file.file_id).subscribe(res => {
        this.numberOfComment = res;
        file.numberOfComment = this.numberOfComment.length;
      })
    }
  }

  getNumberOfLike(callback: any, param: any) {
    let count = 0;
    for (let file of this.medias) {
      this.mediaProvider.getLike(file.file_id).subscribe(res => {
        this.numberOfLike = res;
        file.numberOfLike = this.numberOfLike.length;                
          count += 1;
          if (count == this.medias.length)
          {
            if (callback != null) {
              console.log("getNumberOfLike callback");  
              callback(param);
            }
          }        
      })
    }
  }

  openDetailMedia(id, user_id) {
    this.navCtrl.push(DetailMediaPage, {
      mediaId: id,
      userId: user_id,
    })
  }

  openOtherUser(user_id) {
    if (user_id !== this.currentUser_id) {
      this.navCtrl.push(OtherProfilePage, {
        userId: user_id
      })
    } else {
      this.navCtrl.push(ProfilePage);
    }
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.showPopular = false;
    setTimeout(() => {
      this.end += 5;
      this.getAllMedia(null);
      infiniteScroll.complete();
    }, 3000);
  }

  doRefresh(refresher) {
    this.showPopular = false;
    setTimeout(() => {
      this.medias = [];
      this.end = 5;
      this.getAllMedia(null);
      refresher.complete();
    }, 2000);
  }

  public toggle() {
    console.log('search call', this.toggled)
    this.toggled = this.toggled ? false : true;
 }

 onInputSearch(myInput){
   this.searchArray = [];
   console.log(myInput);
   this.search.title = String(myInput);
   console.log(this.search.title);
   if(myInput !== ''){
    this.mediaProvider.postSearch(this.search).subscribe(data => {
      this.searchArray = data;
      console.log(this.searchArray);
    });     
   }
   
 }

 onSearchEnter(){
  console.log('Enter');
  this.navCtrl.push(SearchPage, {
    searchArray: this.searchArray
  })
}

 onFilter(){
   console.log('Filter');
   let likeValue: any;
   let lastLikeVal = 0;
   let bool = false;
   let sortCallbacks = {
      likes : function (arrayToSort) {
        console.log("onFilter likes callback.");        
        arrayToSort = arrayToSort.sort(function(a,b) 
          {
            return b.numberOfLike - a.numberOfLike
          });
        arrayToSort = arrayToSort.splice(20,80);
        
      }
   }

   this.end = 100;   
   
   this.getAllMedia(sortCallbacks);
   
    this.end = 5;
 }

}
