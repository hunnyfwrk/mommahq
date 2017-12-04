import { Component } from '@angular/core';
import { NavController ,AlertController} from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController,public alertCtrl:AlertController) {

  }
 
}
