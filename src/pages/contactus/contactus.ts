import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Intro } from "../intro/intro";
import { StartPage } from "../start/start";
import { LoginPage } from "../login/login";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { SetPage } from "../set/set";
import { HttpModule, Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html'
})
export class ContactusPage {
  public data:any = '';

  public name; email; message;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public http: Http

  ) {
    // ******      function to Create database on firebase    ******** 

    if (localStorage.getItem('fname')) {
      var name = localStorage.getItem('fname');
      //console.log(name);
      // var startMatch = new RegExp(this.username, "i");
      var sub = name.split(' ');
      console.log(sub[1]);
      this.name = sub[0];
      this.email = sub[1].substring(0, 1);

      console.log(this.email);
    }
    this.email = localStorage.getItem('email');

  }

  contactus() {
    this.navCtrl.push(SetPage);
  }

  newsfeed() {
    this.navCtrl.push(SetPage);
  }

  /*********    function for post Contact Deatil  ************/

  contactdetail(contact) {
    console.log(contact.value);
    // return false;
    //console.log("i'm clicked");
    //console.log(contact.value.fname);

    if (localStorage.getItem('userid')) {
      var postdata = {
        name: contact.value.fname,
        message: contact.value.message,
        email: localStorage.getItem('email'),
        userid: localStorage.getItem('userid'),
        role: 'customer'
      }
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.post("http://netin.crystalbiltech.com/mommahq/app_mail/contactus_email.php", postdata, options)
        .subscribe(response => {
          console.log(response)
        });

      firebase.database().ref('contact/').push({
        name: contact.value.fname,
        message: contact.value.message,
        email: localStorage.getItem('email'),
        userid: localStorage.getItem('userid'),
        role: 'customer'

      }).then(data => {
        console.log(data);
        // alert(data);
        console.log('success');
        let toast = this.toastCtrl.create({
          message: 'Thanks, We will contact you soon',
          duration: 3000,
          cssClass: 'toastCss',
          position: 'bottom',
        });
        toast.present();
        this.data = {
          fname : '',
          message : ''
        };
      }).catch(error => {
        console.log(error);
        let toast = this.toastCtrl.create({
          message: 'An error occured. Try again later',
          duration: 3000,
          cssClass: 'toastCss',
          position: 'bottom',
        });
        toast.present();
        console.log('error');

      });
    }


  }

}
