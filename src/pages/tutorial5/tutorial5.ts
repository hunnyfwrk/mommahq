import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial5',
  templateUrl: 'tutorial5.html'
})
export class Tutorial5Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

    // alert('hh');
  }

  tutorialPage(){
   this.navCtrl.push(Tutorial5Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

