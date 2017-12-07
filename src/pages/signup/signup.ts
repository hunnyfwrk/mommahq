import { Component } from '@angular/core';
import { Platform, NavController, ToastController, LoadingController } from 'ionic-angular';
import { Intro } from "../intro/intro";
import { StartPage } from "../start/start";
import { LoginPage } from "../login/login"; 
import { AboutPage } from "../about/about"; 
import { PolicyPage } from "../policy/policy"; 
// import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { Firebase } from '@ionic-native/firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public data = ''; devicetoken:any = '';  currentdate; referred_by;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public firebase1: Firebase,
    public platform : Platform

  ) {
    // alert('ff')
    
    // var config = {
    //   apiKey: "AIzaSyAxgdItxu5WUJA3_Oj6l84TSj7tx_wRFGo",
    //   authDomain: "momma-31dbe.firebaseapp.com",
    //   databaseURL: "https://momma-31dbe.firebaseio.com/",
    //   storageBucket: "gs://momma-31dbe.appspot.com/",
    //   messagingSenderId: "387051569421",
    // };
    // firebase.initializeApp(config);

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

  }

    getToken() {
    this.firebase1.getToken()
      .then((token) => {
        this.devicetoken = token;
        //alert(token)
        localStorage.setItem('token', token)
      }).catch((err) => {
        console.log('error getting token')
        this.firebase1.onTokenRefresh().subscribe(token => {
          this.devicetoken = token;
          localStorage.setItem('token', token)
        },
          error => {
            // alert('Error refreshing token' + JSON.stringify(error));
          })
      })


  }
 terms_n_conditions(){
    this.navCtrl.push(AboutPage);
 }
  policy(){
    this.navCtrl.push(PolicyPage);
 }
  /*********** Function for register new user **************/

    registration(signupdata) {
      if (this.platform.is('cordova')) {
        this.getToken();
      } else {
        console.log('Not cordova')
        this.devicetoken = 'loggedinthroughbrowser'
      }
      console.log('signup');
      console.log(signupdata.value);
      if (signupdata.value.password.indexOf(' ') >= 0) {
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

        let aa = this;

        if (signupdata.value.code == '' || signupdata.value.code == undefined) {
          signupdata.value.code = '';
          // here
          Loading.present().then(() => {
            firebase.auth().createUserWithEmailAndPassword(signupdata.value.email, signupdata.value.password).then(function (firebaseuser) {
              console.log(firebaseuser);
              console.log('success');
              firebase.database().ref('users/').push({
                firstname: signupdata.value.fname,
                lastname: signupdata.value.lname,
                email: signupdata.value.email,
                password: signupdata.value.password,
                role: 'customer',
                zip: 'abc',
                refcode: signupdata.value.code,
              });
              // alert('Signup successfully');
              firebase.auth().signInWithEmailAndPassword(signupdata.value.email, signupdata.value.password).then(function (data) {
                Loading.dismiss();
                console.log('sign in success');
                var user = firebase.auth().currentUser;
                console.log(user);
                console.log(data);
                firebase.database().ref().child('users').orderByChild("email").equalTo(signupdata.value.email).once("value", ((data) => {
                  console.log(data.val());
                  var userdata = data.val();
                  for (var key in userdata) {

                    if (userdata[key].email == signupdata.value.email) {
                      var id = key
                      var ref = id.slice(10,16);
                     // alert(ref);
                      firebase.database().ref().child('users/' + id).update({
                        token: aa.devicetoken,
                        refcode : ref 
                      }).catch((err) => {
                        //alert('err'+ JSON.stringify(err));
                      })
                      /********* set current logged in userdata on localStorage*********/
                      console.log(userdata[key].email);
                      localStorage.setItem('email', userdata[key].email);
                      localStorage.setItem('userid', key);
                      localStorage.setItem('userpic', null); // set null to get image from localstorage for the first time
                      localStorage.setItem('username', userdata[key].firstname + ' ' + userdata[key].lastname);
                      firebase.database().ref().child('track/' + key).update({
                        status: "logedin",
                        logedin: "email_pass"
                      })
                    }

                  }
                  aa.newsfeedPage();
                }))


              }).catch(function (error) {
                Loading.dismiss();
                console.log('sign in failed');
                console.log(error.message);
                aa.showtoast(error.message);
              });

            }).catch(function (error) {
              Loading.dismiss();
              console.log('error');
              console.log(error.message);
              //alert(error.message);
              aa.showtoast(error.message);

              // return false;
            });

          })
        } else {

          //////////////////////////
          console.log(signupdata.value.code);
          firebase.database().ref().child('users').orderByChild("refcode").equalTo(signupdata.value.code).once("value", ((data) => {
            console.log(data.val());
            if (data.val()) {
              console.log(data.val())
              console.log('match!')
              for(var i in data.val()){
                console.log('referred_by ',i)
                aa.referred_by = i;
              }
              // here
              Loading.present().then(() => {
                firebase.auth().createUserWithEmailAndPassword(signupdata.value.email, signupdata.value.password).then(function (firebaseuser) {
                  console.log(firebaseuser);
                  console.log('success');
                  firebase.database().ref('users/').push({
                    firstname: signupdata.value.fname,
                    lastname: signupdata.value.lname,
                    email: signupdata.value.email,
                    password: signupdata.value.password,
                    role: 'customer',
                    zip: 'abc',
                    refcode: signupdata.value.code,
                  });
                  // alert('Signup successfully');
                  firebase.auth().signInWithEmailAndPassword(signupdata.value.email, signupdata.value.password).then(function (data) {
                    Loading.dismiss();
                    console.log('sign in success');
                    var user = firebase.auth().currentUser;
                    console.log(user);
                    console.log(data);





                    firebase.database().ref().child('users').orderByChild("email").equalTo(signupdata.value.email).once("value", ((data) => {
           
                      console.log(data.val());
                      var userdata = data.val();
                      for (var key in userdata) {

                        if (userdata[key].email == signupdata.value.email) {
                          var id = key
                          var ref = id.slice(10,16);
                          //alert(ref);
                          firebase.database().ref().child('users/' + id).update({
                            token: aa.devicetoken,
                            refferedby : aa.referred_by,
                            refcode : ref
                          }).catch((err) => {
                            //alert('err'+ JSON.stringify(err));
                          })
                          /********* set current logged in userdata on localStorage*********/
                          console.log(userdata[key].email);
                          localStorage.setItem('email', userdata[key].email);
                          localStorage.setItem('userid', key);
                           localStorage.setItem('userpic', null); // set null to get image from localstorage for the first time
                           localStorage.setItem('username', userdata[key].firstname + ' ' + userdata[key].lastname);
                           firebase.database().ref().child('sweeptakes/' + id + '/' + aa.currentdate + '/used_refcode').transaction((values) => {
                            var newValue = (values || 0) + 1;
                            return newValue;
                           })
                           firebase.database().ref().child('sweeptakes/' + aa.referred_by + '/' + aa.currentdate + '/referred_newuser').transaction((values) => {
                            var newValue = (values || 0) + 1;
                            return newValue;
                           })

                           firebase.database().ref().child('track/' + key).update({
                             status: "logedin",
                             logedin: "email_pass"
                           })
                        }

                      }
                      aa.newsfeedPage();
                      
                    }))

                  }).catch(function (error) {
                    Loading.dismiss();
                    console.log('sign in failed');
                    console.log(error.message);
                    aa.showtoast(error.message);
                  });

                }).catch(function (error) {
                  Loading.dismiss();
                  console.log('error');
                  console.log(error.message);
                  //alert(error.message);
                  aa.showtoast(error.message);

                  // return false;
                });

              })

            } else {
              this.showtoast('Invalid reference code');
              return false;
            }
          }))

        }
      }
    }


    showtoast(msg){
       var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
    }



  startPage() {
    this.navCtrl.push(StartPage);
  }

  loginPage() {
    this.navCtrl.push(LoginPage);
  }
newsfeedPage(){
   this.navCtrl.push(NewsfeedPage, {'bit' : '1'});
}
}
