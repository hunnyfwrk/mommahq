import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial7',
  templateUrl: 'tutorial7.html'
})
export class Tutorial7Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

//alert('dghj')
  }
  tutorialPage(){
   this.navCtrl.push(Tutorial7Page);
  }

dismiss() {this.viewCtrl.dismiss();}

}

