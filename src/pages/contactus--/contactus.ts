import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Intro } from "../intro/intro";
import { StartPage } from "../start/start";
import { LoginPage } from "../login/login";
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { SetPage } from "../set/set";


@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html'
})
export class ContactusPage {

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController

  ) {

  }

   newsfeed(){
    this.navCtrl.push(SetPage);
  }



}
