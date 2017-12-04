import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsfeedPage} from '../newsfeed/newsfeed';
import { SignupPage} from '../signup/signup';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  terms;
  constructor(public navCtrl: NavController) {
    this.getDetails();
  }

  getDetails(){
            firebase.database().ref().child('policy').once('value', ((data)=> {
            console.log(data.val().terms)
            this.terms = data.val().terms;
          }))
  }

   signup(){
    this.navCtrl.push(SignupPage);
  }
}
