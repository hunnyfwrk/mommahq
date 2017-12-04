import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SetPage } from '../set/set';
import { AlertController,Events } from 'ionic-angular';
import { SavediscussionPage } from "../savediscussion/savediscussion";
import { SocialSharing } from '@ionic-native/social-sharing';
import { RulesPage } from "../rules/rules"; 
@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html'
})
export class InvitePage {
  public userr_id; currentdate; refcode;picture; firstname;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public socialSharing: SocialSharing,
    public events : Events
  ) {
    this.picture = localStorage.getItem("userpic");
    console.log(this.picture)
    this.events.subscribe('userpic', ()=>{
      this.picture = localStorage.getItem("userpic"); // when user changes her pic
    })
    this.userr_id = localStorage.getItem('userid'); 
    this.events.subscribe('username', () => {
      var name = localStorage.getItem('username');
      var sub = name.split(' ');
      this.firstname = sub[0];

    })
    var firstname = localStorage.getItem('username').split(' '); 
     this.firstname = firstname[0]
    var today = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = dd;
    }
    if (mm < 10) {
      mm = mm;
    }
    this.currentdate = dd + '-' + mm + '-' + yyyy;
    this.getCode();
  }

  set() {
    this.navCtrl.push(SetPage);
  }
   rules(){
   this.navCtrl.push(RulesPage);
 }

  getCode(){
         console.log(localStorage.getItem('email'));
         var email = localStorage.getItem('email')
          firebase.database().ref().child('users').orderByChild("email").equalTo(email).once("value", ((userdata) => {
              console.log(userdata.val())
              if(userdata.val()){
                  console.log('refcode')
                  for(var i in userdata.val()){
                        console.log(userdata.val()[i].refcode)
                        this.refcode = userdata.val()[i].refcode
                  }
              }
          }))
  }
  public smsshare() {
    this.socialSharing.shareViaSMS('Join me on MommaHQ, a great new FREE app where you can get real time answers from real moms no matter where you are!  Use my code, '+ this.refcode + ' and download here. ', '').then(() => {
      // firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/socialshare').transaction((values) => {
      //   var newValue = (values || 0) + 1;
      //   return newValue;
      // })

    });
  }

  public emailshare() {

    this.socialSharing.canShareViaEmail().then(() => {
      this.socialSharing.shareViaEmail('Hi Fellow Momma! I love MommaHQ,' +
                            'a great new app for amazing mommas just like you, where you can get real time answers'+
                            ' from real moms no matter where you are! Use my code, ' + this.refcode + ' and install the'+
                            ' free app now by clicking here.       ' + this.firstname+'.', '   Join me on MommaHQ - a great new FREE app for moms!', ['']).then(() => {

      }).catch(() => {
        // Error!
      });

    }).catch(() => {
      //  alert('email sharing not possible');
      
    });
  }

  public twittersharing() {

    this.socialSharing.shareViaTwitter('Join me on MommaHQ, a new FREE app for amazing moms just like you! Use my code  '+ this.refcode +'  and download here.  ', '', '').then(() => {
      // firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/socialshare').transaction((values) => {
      //   var newValue = (values || 0) + 1;
      //   return newValue;
      // })
    }).catch((err) => {
        alert('Error connecting to Twitter')
    });

  }

  // public fbsharing() {
    
  //   this.socialSharing.shareViaFacebook('http://www.mommahq/usepromocode/'+this.refcode, '', '').then(() => {
  //     // firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/socialshare').transaction((values) => {
  //     //   var newValue = (values || 0) + 1;
  //     //   return newValue;
  //     // })
  //   })
  //   .catch((err) => {
  //      alert('Error connecting to Facebook')
  //   });
  // }

  public fbsharing() {
    
    this.socialSharing.shareViaFacebook('http://netin.crystalbiltech.com/mommahq/app_mail/refral_code.html?code='+this.refcode, '', '').then(() => {
      // firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/socialshare').transaction((values) => {
      //   var newValue = (values || 0) + 1;
      //   return newValue;
      // })
    })
    .catch((err) => {
       alert('Error connecting to Facebook')
    });
  }






  logout() {
    var aa = this;
    alert('logout');
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      alert('success');
      localStorage.clear();
      aa.signinpage();
    }).catch(function (error) {
      console.log(error);
      // An error happened.
    });
  }

  signinpage() {
    this.navCtrl.push(LoginPage);
  }


}
