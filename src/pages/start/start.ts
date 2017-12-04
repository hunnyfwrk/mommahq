import { Component } from '@angular/core';
import { NavController, Platform, ToastController, LoadingController } from 'ionic-angular';
import { Intro } from "../intro/intro";
import { SignupPage } from "../signup/signup";
import { NewsfeedPage } from "../newsfeed/newsfeed";
import { TabsPage } from "../tabs/tabs";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';
import { Firebase } from '@ionic-native/firebase';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  devicetoken;
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public facebook: Facebook,
    public firebase1: Firebase,
    public loadingCtrl: LoadingController,
    public googlePlus : GooglePlus
  ) {
    // platform.ready().then(() => {
    //   var lastTimeBackPress = 0;
    //   var timePeriodToExit = 2000;

    //   platform.registerBackButtonAction(() => {
    //     // get current active page
    //     let view = this.navCtrl.getActive();
    //     if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
    //       this.platform.exitApp(); //Exit from app
    //     } else {
    //       // alert('Press back again to exit App?');
    //       let toast = this.toastCtrl.create({
    //         message: 'Press back again to exit App?',
    //         duration: 3000,
    //         position: 'bottom'
    //       });
    //       toast.present();
    //       lastTimeBackPress = new Date().getTime();
    //     }
    //   });
    // });



    /*****************code for firebase setup*********** */
    // var config = {
    //   apiKey: "AIzaSyAxgdItxu5WUJA3_Oj6l84TSj7tx_wRFGo",
    //   authDomain: "momma-31dbe.firebaseapp.com",
    //   databaseURL: "https://momma-31dbe.firebaseio.com/",
    //   storageBucket: "gs://momma-31dbe.appspot.com/",
    //   messagingSenderId: "387051569421",
    // };
    // firebase.initializeApp(config);
    this.ionViewDidEnter();
  }
  getToken() {
    //  alert('token part')
    this.firebase1.getToken()
      .then((token) => {
        this.devicetoken = token;
        //  alert(token)
        localStorage.setItem('token', token)
      }).catch((err) => {
        console.log('error getting token')
        //  alert(err)
        this.firebase1.onTokenRefresh().subscribe(token => {
          this.devicetoken = token;
          localStorage.setItem('token', token)
        },
          error => {
            //  alert('Error refreshing token' + JSON.stringify(error));
          })
      })


  }

  /***********function for facebook login ************/
  facebookLogin(): void {
    this.getToken();
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });
    this.facebook.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          // alert("Firebase success: " + JSON.stringify(success));
          Loading.present().then(() => {
            firebase.database().ref().child('users').orderByChild("email").equalTo(success.email).once("value", ((userdata) => {
              //alert(JSON.stringify(userdata.val()));
              var userdetail = userdata.val();


              if (!(userdata.val())) {
                var usename = success.displayName.split(" ");
                var uservalues = {
                  email: success.email,
                  firstname: usename[0],
                  lastname: usename[1],
                  token: this.devicetoken,
                  role : 'customer',
                  image : success.photoURL
                }

                var newPostKey = firebase.database().ref().child('users').push().key;
                var updates = {};
                updates['users/' + newPostKey] = uservalues;
                firebase.database().ref().update(updates);
                localStorage.setItem('email', success.email);

                localStorage.setItem('userpic', success.photoURL);
                localStorage.setItem('userid', newPostKey);
                localStorage.setItem('username', success.displayName);
                firebase.database().ref().child('track/' + i).update({
                  status: "logedin",
                  logedin: "fb"
                })
                firebase.database().ref().child('users').orderByChild("email").equalTo(success.email).once("value", ((userdata) => {
                  console.log(userdata.val())
                  for (var key in userdata.val()) {
                    var id = key
                    var ref = id.slice(10, 16);
                    //alert(ref);
                    firebase.database().ref().child('users/' + id).update({
                      refcode: ref
                    }).catch((err) => {
                      //alert('err'+ JSON.stringify(err));
                    })
                  }
                }))
                Loading.dismiss()
                this.TabsPage('1')

              } else {
                for (var i in userdetail) {
                  firebase.database().ref().child('track/' + i).update({
                    status: "logedin",
                    logedin: "fb"
                  })

                  var id = i
                  var ref = id.slice(10, 16);
                  // alert(ref);
                  firebase.database().ref().child('users/' + id).update({
                    refcode: ref,
                    token: this.devicetoken,
                  }).catch((err) => {
                    //alert('err'+ JSON.stringify(err));
                  })

                  localStorage.setItem('email', success.email);
                  localStorage.setItem('userid', i);

                localStorage.setItem('userpic', success.photoURL);
                  localStorage.setItem('username', success.displayName);
                  Loading.dismiss()
                  this.TabsPage('0')
                }

              }

            }),
              ((error) => {
                // alert(JSON.stringify(error));
                 this.showtoast('Login was unsuccessful');
              }))

            // 
          }).catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });
        })
    }).catch((error) => {
      // alert(JSON.stringify(error));
      // alert('login failure');
      // alert(JSON.stringify(error));
       this.showtoast('Login was unsuccessful');
    });
  }
  
  googlelogin(): void {
        this.getToken();
        var Loading = this.loadingCtrl.create({
          spinner: 'bubbles',
        });

      this.googlePlus.login({}).then( res => {
            console.log(res) 
            Loading.present().then(() => {
            firebase.database().ref().child('users').orderByChild("email").equalTo(res.email).once("value", ((userdata) => {
             // alert(JSON.stringify(userdata.val()));
              var userdetail = userdata.val();
              
              if (!(userdata.val())) {
                var usename = res.displayName.split(" ");
                var img = res.imageUrl;
                if(img == undefined){
                    img = null
                }
                var uservalues = {
                  email: res.email,
                  firstname: res.givenName,
                  lastname: res.familyName,
                  token: this.devicetoken,
                  role: 'customer',
                  image : img,
                  googleid : res.userId
                }

                var newPostKey = firebase.database().ref().child('users').push().key;
                var updates = {};
                updates['users/' + newPostKey] = uservalues;

                console.log('l')
                firebase.database().ref().update(updates);
                localStorage.setItem('email', res.email);
                console.log('m')
                localStorage.setItem('userpic', img);
                
                localStorage.setItem('userid', newPostKey);
                localStorage.setItem('username', res.displayName);
                localStorage.setItem('google', '1');
                
                firebase.database().ref().child('track/' + i).update({
                  status: "logedin",
                  logedin: "g+"
                })
                console.log('n')
                firebase.database().ref().child('users').orderByChild("email").equalTo(res.email).once("value", ((userdata) => {
                  console.log(userdata.val())
                  for (var key in userdata.val()) {
                    var id = key
                    var ref = id.slice(10, 16);
                
                    firebase.database().ref().child('users/' + id).update({
                      refcode: ref
                    }).catch((err) => {
                      //alert('err'+ JSON.stringify(err));
                    })
                  }
                }))
                Loading.dismiss()
                this.TabsPage('1')

              } else {

                for (var i in userdetail) {
                  firebase.database().ref().child('track/' + i).update({
                    status: "logedin",
                    logedin: "g+"
                  })

                  var id = i
                  var ref = id.slice(10, 16);
                  // alert(ref);
                  firebase.database().ref().child('users/' + id).update({
                    refcode: ref,
                    token: this.devicetoken,
                  }).catch((err) => {
                    alert('err'+ JSON.stringify(err));
                  })

                  localStorage.setItem('email', res.email);
                  localStorage.setItem('google', '1');
                    var img = res.imageUrl;
                    if(img == undefined){
                        img = null
                    }
                  localStorage.setItem('userpic', img);
                  localStorage.setItem('userid', i);
                  localStorage.setItem('username', res.displayName);
                  Loading.dismiss()
                  this.TabsPage('0')

                }

              }

            }),
              ((error) => {
                // alert(JSON.stringify(error));
                 this.showtoast('Login was unsuccessful');
              }))
          })
            
      }, err => {
          //alert("Error: "+ JSON.stringify(err));
      });
    }

  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }


  TabsPage(bit) {
      if(bit == '1'){
         this.navCtrl.push(NewsfeedPage, { bit : '1'})
      } else {
         this.navCtrl.push(NewsfeedPage);
      }
  }


  /**************** function for check network connection *******************/
  ionViewDidEnter() {
    console.log(window.navigator.onLine);
    if (window.navigator.onLine == true) {
      // alert('Network connection');
    } else {
      // alert('Network connection failed');
      // alert('Network connection failed');
      let toast = this.toastCtrl.create({
        message: 'Network connection failed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }

  }

  nextPage() {
    this.navCtrl.push(SignupPage);
  }

}
