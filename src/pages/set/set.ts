import { Component } from '@angular/core';
import { NavController, AlertController,ModalController,Events,ToastController } from 'ionic-angular';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { SavediscussionPage } from '../savediscussion/savediscussion';
import { LoginPage } from "../login/login";
import { ProfilePage } from "../profile/profile";
import { InvitePage } from "../invite/invite";
import { ContactusPage } from "../contactus/contactus";
import { AboutPage } from "../about/about";
import { Tutorial6Page } from "../tutorial6/tutorial6";
import { Tutorial7Page } from "../tutorial7/tutorial7";
import { Tutorial8Page } from "../tutorial8/tutorial8";
import { GooglePlus } from '@ionic-native/google-plus';
@Component({
  selector: 'page-set',
  templateUrl: 'set.html'
})
export class SetPage {
  public username; firstname; lastname;settingalert; settingalert2;settingalert3;picture;
  user_id;
  tutorial6;tutorial7;tutorial8;
  constructor(
    public navCtrl: NavController, 
    public alertCtrl : AlertController,
    public modalCtrl: ModalController,
    public events : Events,
    public toastCtrl : ToastController,
    public googlePlus : GooglePlus) 
  {
    //alert('k')
    this.username = localStorage.getItem("username");
    this.events.subscribe('username', () => {
        this.username = localStorage.getItem("username");
        var sub = this.username.split(' ');
        this.firstname = sub[0];
        this.lastname = sub[1].substring(0, 1);
    })
   
    var sub = this.username.split(' ');
    console.log(sub[1]);
    this.firstname = sub[0];
    this.lastname = sub[1].substring(0, 1);
    this.user_id = localStorage.getItem('userid')
     this.picture = localStorage.getItem("userpic");
    console.log(this.picture)
    this.events.subscribe('userpic', ()=>{
      this.picture = localStorage.getItem("userpic"); // when user changes her pic
    })
    this.referstatus();

  }

  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }
  checkLikedstatus() {
    firebase.database().ref().child('liked_status/' + this.user_id).orderByChild('tutorial')
      .equalTo('tutorial6').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {
              this.savedstatus();
        } else {
          this.settingalert = this.alertCtrl.create({
            cssClass: 'sunny01 sunny seta',
            title: 'Your Profile',
            message: 'View/edit your profile and keep track of how many sweepstakes entries you have.',
            subTitle: '',
            buttons: [
              {
                text: 'X',
                role: 'cancel',
                cssClass: 'close_position',
                handler: data => {
                  console.log('Cancel clicked');
                  // if (this.tutorial5 != undefined) {
                  //   this.tutorial5.dismiss();
                  // }
                }
              },
            ]
          });

          this.settingalert.present();
          this.tutorial6 = this.modalCtrl.create(Tutorial6Page);
          this.tutorial6.present();
           firebase.database().ref().child('liked_status/' + this.user_id).push({
            tutorial: 'tutorial6'
          })

          this.tutorial6.onDidDismiss(res => {
               this.settingalert.dismiss();
               this.savedstatus();
          })
        }

      }))
  }

  referstatus() {
    firebase.database().ref().child('liked_status/' + this.user_id).orderByChild('tutorial')
      .equalTo('tutorial7').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {
              this.checkLikedstatus();
        } else {
          this.settingalert2 = this.alertCtrl.create({
            cssClass: 'sunny01 sunny setb',
            title: 'Invite Friends - Enter Sweeps!',
            message: 'Every comment, friend invite and post gets you an additional entry into the monthly sweepstakes!',
            subTitle: '',
            buttons: [
              {
                text: 'X',
                role: 'cancel',
                cssClass: 'close_position',
                handler: data => {
                  console.log('Cancel clicked');
                  // if (this.tutorial5 != undefined) {
                  //   this.tutorial5.dismiss();
                  // }
                }
              },
            ]
          });

          this.settingalert2.present();
          this.tutorial7= this.modalCtrl.create(Tutorial7Page);
          this.tutorial7.present();
           firebase.database().ref().child('liked_status/' + this.user_id).push({
            tutorial: 'tutorial7'
          })

          this.tutorial7.onDidDismiss(res => {
            this.settingalert2.dismiss();
            this.checkLikedstatus();
          })
        }

      }))
  }


  savedstatus() {
    firebase.database().ref().child('liked_status/' + this.user_id).orderByChild('tutorial')
      .equalTo('tutorial8').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {
              //this.referstatus();
        } else {
          this.settingalert3 = this.alertCtrl.create({
            cssClass: 'sunny01 sunny setc',
            title: 'Saved Discussions',
            message: 'Easily access all your saved discussions without having to scroll through the feed!',
            subTitle: '',
            buttons: [
              {
                text: 'X',
                role: 'cancel',
                cssClass: 'close_position',
                handler: data => {
                  console.log('Cancel clicked');
                  // if (this.tutorial5 != undefined) {
                  //   this.tutorial5.dismiss();
                  // }
                }
              },
            ]
          });

          this.settingalert3.present();
          this.tutorial8= this.modalCtrl.create(Tutorial8Page);
          this.tutorial8.present();
           firebase.database().ref().child('liked_status/' + this.user_id).push({
            tutorial: 'tutorial8'
          })

          this.tutorial8.onDidDismiss(res => {
            this.settingalert3.dismiss();
            this.navCtrl.setRoot(NewsfeedPage);
            this.navCtrl.popToRoot();
          })
        }

      }))
  }

  newsfeed() {
    this.navCtrl.push(NewsfeedPage);
  }

  contactus() {
    this.navCtrl.push(ContactusPage);
  }

  save() {
    this.navCtrl.push(SavediscussionPage);
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }

  invite() {
    this.navCtrl.push(InvitePage);
  }



  logout() {
    var aa = this;
    var userid = localStorage.getItem('userid');
    console.log(localStorage.getItem('google'));
    if(localStorage.getItem('google') == '1'){
         this.googlePlus.logout().then((success)=>{
            firebase.database().ref().child('track/' + userid).update({
              status: "Logged out",
              //logedin: "fb"
            })
            // Sign-out successful.
            localStorage.clear();
            aa.signinpage();
         }).catch((err)=>{
             this.showtoast('Could not log out');
         })
        
    } else {
       firebase.auth().signOut().then(function () {
            firebase.database().ref().child('track/' + userid).update({
              status: "Logged out",
              //logedin: "fb"
            })
            // Sign-out successful.
            localStorage.clear();

            aa.signinpage();
        }).catch(function (error) {
            console.log(error);
            // An error happened.
        }); 
    }
    
  }

  signinpage() {
    this.navCtrl.push(LoginPage).then(() => {
      const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(0, index);
    });
  }


}


