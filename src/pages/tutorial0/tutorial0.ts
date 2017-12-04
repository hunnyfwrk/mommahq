import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial0',
  templateUrl: 'tutorial0.html'
})
export class Tutorial0Page {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {
   //alert("xdsgsdg")
  }
 
dismiss() {this.viewCtrl.dismiss();}

}

