import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { Intro } from "../intro/intro";
import { StartPage } from "../start/start";
import { SignupPage } from "../signup/signup";
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { Firebase } from '@ionic-native/firebase';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public data = '';
  public devicetoken = '';
  public user = '';
  public window: Window;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public facebook: Facebook,
    public firebase1: Firebase,
    public platform: Platform,
    public googlePlus : GooglePlus
  ) {
//    alert('honey')
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

  /**************** login function **************/
  login(signindata) {
    if (this.platform.is('cordova')) {
      this.getToken();
    } else {
      console.log('Not cordova')
      this.devicetoken = 'loggedinthroughbrowser'
    }

    if (signindata.value.password.indexOf(' ') >= 0) {
      let toast = this.toastCtrl.create({
        message: 'Space not allowed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      return false;
    } else {
      var Loading = this.loadingCtrl.create({
        spinner: 'bubbles',
      });
      var aa = this;
      Loading.present().then(() => {
        firebase.auth().signInWithEmailAndPassword(signindata.value.email, signindata.value.password).then(function (data) {
          Loading.dismiss();
          console.log('sign in success');
          var user = firebase.auth().currentUser;
          console.log(user);
          console.log(data);
          firebase.database().ref().child('users').once('value', function (data) {
            console.log(data.val());
            var userdata = data.val();
            for (var key in userdata) {

              if (userdata[key].email == signindata.value.email) {
                console.log('LOGED IN USER', key)
                var id = key
                // alert(id)
                //alert(aa.devicetoken)
                firebase.database().ref().child('users/' + id).update({
                  token: aa.devicetoken,
                }).catch((err) => {
                  //alert('err'+ JSON.stringify(err));
                })

                /********* set current logged in userdata on localStorage*********/
                console.log(userdata[key].email);
                localStorage.setItem('email', userdata[key].email);
                localStorage.setItem('userid', key);
                if (userdata[key].image == undefined) {
                  localStorage.setItem('userpic', null);
                } else {
                  localStorage.setItem('userpic', userdata[key].image);
                }
                localStorage.setItem('username', userdata[key].firstname + ' ' + userdata[key].lastname);
                firebase.database().ref().child('track/' + key).update({
                  status: "Logged in",
                  logedin: "email_pass"
                })
              }

            }
            // aa.showtoast('signin successfully');
            aa.TabsPage('0');

          })
        }).catch(function (error) {
          Loading.dismiss();
          console.log('sign in failed');
          console.log(error.message);
          aa.showtoast(error.message);
        });
      })
    }
  }

  forgetPassword(emailaddress) {
    var aa = this;
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(emailaddress).then(function () {
      // An success happened.
      aa.showtoast('Check your mail to reset your password.');
      //alert('check your mail to reset your password');
    }).catch(function (error) {
      // An error happened.
      aa.showtoast('Email was not sent. Are you sure you are registered with us?');
    });
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
         // alert(JSON.stringify(success));

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
                  role: 'customer',
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
                  localStorage.setItem('userpic', success.photoURL);
                  localStorage.setItem('userid', i);
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
          })
          // 
        }).catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });

    }).catch((error) => {
      this.showtoast('Login was unsuccessful');
      // alert(JSON.stringify(error));
      // alert('login failure');
      // alert(JSON.stringify(error));
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
                    alert(ref);
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
                  if(res.imageUrl){
                    localStorage.setItem('userpic', res.imageUrl);
                  }
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
          this.showtoast('Login cancelled');
      });
    }


  startPage() {
    this.navCtrl.push(StartPage);
  }
  TabsPage(bit) {
      if(bit == '1'){
        this.navCtrl.push(NewsfeedPage,{ bit : '1'});
      } else {
        this.navCtrl.push(NewsfeedPage);
      }
   
  }
  signupPage() {
    this.navCtrl.push(SignupPage);
  }
  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Forgot Password?',
      message: "Enter your email address to receive a reset password link",
      cssClass: 'sunny',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Reset Password',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.email);
            this.forgetPassword(data.email);
          }
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        // {
        //   cssClass:'closebtn ion-icon md-close',
        // }
      ]
    });
    prompt.present();
  }
}


