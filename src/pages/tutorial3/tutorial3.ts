import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial3',
  templateUrl: 'tutorial3.html'
})
export class Tutorial3Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
  tutorialPage(){
   this.navCtrl.push(Tutorial3Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

