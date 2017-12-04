import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsfeedPage} from '../newsfeed/newsfeed';
import { ProfilePage} from '../profile/profile';
@Component({
  selector: 'page-rules',
  templateUrl: 'rules.html'
})
export class RulesPage {
  rules;
  constructor(public navCtrl: NavController) {
    this.getDetails();
  }

  getDetails(){
            firebase.database().ref().child('policy').once('value', ((data)=> {
            console.log(data.val().rules)
            this.rules = data.val().rules;
          }))
  }

   profile(){
    this.navCtrl.push(ProfilePage);
  }
}
