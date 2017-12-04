import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial8',
  templateUrl: 'tutorial8.html'
})
export class Tutorial8Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
  tutorialPage(){
   this.navCtrl.push(Tutorial8Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

