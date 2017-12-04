import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial6',
  templateUrl: 'tutorial6.html'
})
export class Tutorial6Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
  tutorialPage(){
   this.navCtrl.push(Tutorial6Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

