import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial2',
  templateUrl: 'tutorial2.html'
})
export class Tutorial2Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {
  // alert('honey')
  }
  tutorialPage(){
   this.navCtrl.push(Tutorial2Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

