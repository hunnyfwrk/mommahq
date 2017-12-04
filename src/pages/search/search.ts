import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsfeedPage} from '../newsfeed/newsfeed';
import { SavediscussionPage } from '../savediscussion/savediscussion';
import { LoginPage } from "../login/login";
import { ProfilePage } from "../profile/profile";
import { InvitePage } from "../invite/invite";


@Component({
  selector: 'page-searchPage',
  templateUrl: 'search.html'
})
export class SearchPage {
  constructor(public navCtrl: NavController) {

  }

 newsfeed(){
    this.navCtrl.push(NewsfeedPage);
  }



}


 