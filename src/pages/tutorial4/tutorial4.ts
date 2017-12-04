import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial4',
  templateUrl: 'tutorial4.html'
})
export class Tutorial4Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  // alert('hh');

  }
  tutorialPage(){
   this.navCtrl.push(Tutorial4Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

