import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsfeedPage} from '../newsfeed/newsfeed';
import { SignupPage} from '../signup/signup';
@Component({
  selector: 'page-policy',
  templateUrl: 'policy.html'
})
export class PolicyPage {
  policy;
  constructor(public navCtrl: NavController) {
    this.getDetails();
  }

  getDetails(){
            firebase.database().ref().child('policy').once('value', ((data)=> {
            console.log(data.val())
            this.policy = data.val().policy;
          }))
  }

   signup(){
    this.navCtrl.push(SignupPage);
  }
}
