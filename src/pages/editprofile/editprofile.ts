import { Component } from '@angular/core';
import { NavController, LoadingController, Events, ToastController } from 'ionic-angular';
import { Intro } from "../intro/intro";
import { StartPage } from "../start/start";
import { SignupPage } from "../signup/signup";
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { NewsfeedProvider } from '../../providers/newsfeed/newsfeed';
import { HttpModule, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from "../profile/profile";

@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})
export class EditprofilePage {
  public childdata: any = [];
  public child; childrens; referred_by:any=null;
  public userProfile: any; dontshowupdatemsg:any=0;currentdate;
  public readonly = true; showtitle:any = "Add referral code";
  options: { key: string, value: string }[] = [];

  submitted = false;
  public data = {
    fname: '',
    lname: '',
    childname: [],
    childAge: [],
    refcode: ''
  };
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public newsfeedProvider: NewsfeedProvider,
    public facebook: Facebook,
    public events : Events
  ) {
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
    this.showprofile();    // Load Show profile Functiuon 
//     alert('Hello')
  }

  presentProfileModal() {
    this.navCtrl.push(EditprofilePage);
  }

  /**************** login function **************/




  onSubmit() {
    console.log(this.data);
    var user_id = localStorage.getItem("userid");
    if(this.userProfile.refferedby == undefined){
        if(this.data.refcode != ''){
            firebase.database().ref().child('users').orderByChild("refcode").equalTo(this.data.refcode).once("value", ((data) => {
                 if (data.val()) {
                    console.log(data.val())
                    this.dontshowupdatemsg = 0;
                  for(let i in data.val()){
                    console.log('referred_by ',i)
                    this.referred_by = i;
                    console.log(this.referred_by)
                    firebase.database().ref().child('sweeptakes/' + user_id + '/' + this.currentdate + '/used_refcode').transaction((values) => {
                        var newValue = (values || 0) + 1;
                        return newValue;
                    })
                    firebase.database().ref().child('sweeptakes/' + this.referred_by + '/' + this.currentdate + '/referred_newuser').transaction((values) => {
                     var newValue = (values || 0) + 1;
                     return newValue;
                    })
                    this.saveinfo()
                  }
                 } else {
                    this.showPrompt();
                    this.dontshowupdatemsg = 1;
                 }
            }))
        } else {
             this.saveinfo() 
        }
    } else {
            this.referred_by = this.data.refcode
            this.saveinfo()
    }
 
  }
    
  saveinfo(){
     var user_id = localStorage.getItem("userid");
    if(this.data.childAge == undefined || this.data.childAge == null){
      firebase.database().ref().child("users/" + user_id).update({
        firstname: this.data.fname,
        lastname: this.data.lname,
        refferedby: this.referred_by
      }).then((res) => {
        if(this.dontshowupdatemsg != 1){
           this.showtoast('Profile updated successfully');
        }
        
        localStorage.setItem('username', this.data.fname + ' ' + this.data.lname)
        this.events.publish('username', 'username')
      })

    } else {
      firebase.database().ref().child("users/" + user_id).update({
        firstname: this.data.fname,
        lastname: this.data.lname,
        refferedby : this.referred_by
      }).then((res) => {
        localStorage.setItem('username', this.data.fname + ' ' + this.data.lname);
        this.events.publish('username', 'username')
        if(this.dontshowupdatemsg != 1){
           this.showtoast('Profile updated successfully');
        }
      })
      for (var i in this.data.childAge) {
        for (var j in this.data.childname) {
          if (i == j) {
            var age = this.newsfeedProvider.getAge(this.data.childAge[i]);
            console.log(age, 'age')
           // if (age < 18) {
              firebase.database().ref().child("Children/" + user_id + "/child/" + i).update({
                childDob: this.data.childAge[i],
                childAge: age,
                childname: this.data.childname[j]
              })

            // } else {
            //   let toast = this.toastCtrl.create({
            //     message: 'One or more children were above the age of 18 and were not updated',
            //     duration: 5000,
            //     position: 'bottom'
            //   });
            //   toast.present();
            // }
          }
        }
      }
    }
  }

  login(signindata) {
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
          firebase.database().ref().child('users').on('value', function (data) {
            console.log(data.val());
            var userdata = data.val();
            for (var key in userdata) {

              if (userdata[key].email == signindata.value.email) {
                /********* set current logged in userdata on localStorage*********/
                console.log(userdata[key].email);
                localStorage.setItem('email', userdata[key].email);
                localStorage.setItem('userid', key);
                localStorage.setItem('username', userdata[key].firstname + ' ' + userdata[key].lastname);
                firebase.database().ref().child('track/' + key).update({
                  status: "logedin",
                  logedin: "email_pass"
                })

              }

            }
            // aa.showtoast('signin successfully');
            aa.TabsPage();

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
      aa.showtoast('check your mail to reset your password');
      //alert('check your mail to reset your password');
    }).catch(function (error) {
      // An error happened.
      aa.showtoast('Email not sent');
    });
  }


  /***********function for facebook login ************/
  facebookLogin(): void {
    this.facebook.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          alert("Firebase success: " + JSON.stringify(success));
          firebase.database().ref().child('users').orderByChild("email").equalTo(success.email).once("value", ((userdata) => {
            alert(JSON.stringify(userdata.val()));
            var userdetail = userdata.val();
            if (!(userdata.val())) {
              firebase.database().ref().child('users/').push({
                email: success.email,
              })
            } else {
              for (var i in userdetail) {
                firebase.database().ref().child('track/' + i).update({
                  status: "logedin",
                  logedin: "fb"
                })
              }
            }
          }),
            ((error) => {
              alert(JSON.stringify(error));
            }))

          // this.TabsPage();
        }).catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });

    }).catch((error) => {
      alert(JSON.stringify(error));
      alert('login failure');
      // alert(JSON.stringify(error));
    });
  }



  startPage() {
    this.navCtrl.push(StartPage);
  }
  TabsPage() {
    this.navCtrl.push(NewsfeedPage);
  }
  signupPage() {
    this.navCtrl.push(SignupPage);
  }
  set() {
    this.navCtrl.push(ProfilePage);
  }


  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Invalid Referral code',
      message: "Referral code that you entered is invalid.",
      cssClass: 'sunny',
      buttons: [
        {
          text: 'Okay',
          handler: data => {
//              prompt.dismiss()
          }
        },
        // {
        //   cssClass:'closebtn ion-icon md-close',
        // }
      ]
    });
    prompt.present();
  }

  /***************************** Edir User Profile****************************************/
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }

  editprofile(editForm) {
    var userid = localStorage.getItem('userid');
    console.log(userid);

    firebase.database().ref().child('users/' + userid).on('value', ((datachild) => {
      this.userProfile = datachild.val();
      console.log(this.userProfile)

      // alert(JSON.stringify(this.userProfile));
    }))
    //*****************************Get data from Children Table******************************

    var userid = localStorage.getItem('userid');
    console.log(userid);
    //  alert(userid+'child_id');
    firebase.database().ref().child('Children/' + userid).on('value', ((datachild) => {
      this.child = datachild.val();
      console.log(this.child);
      for (var i in this.child.child) {
        console.log('mydata')
        console.log(i);
        this.childdata.push({ i: this.child.child[i] });
        console.log(this.childdata);

      }

    }))

    ////************************************************//



    var data_Profile = {
      firstname: editForm.value.fname,
      lastname: editForm.value.lname,
      cname: editForm.value.childname,
      cage: editForm.value.age,
    }

    //alert(JSON.stringify(data_Profile));
    var serialized = this.serializeObj(data_Profile);
    console.log(serialized);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

  }

  /*****************************  End Edit   ****************************************/
  public Loader = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  public showprofile() {
    this.Loader.present();
    var userid = localStorage.getItem("userid");
    console.log(userid);
    // alert(userid);
    firebase.database().ref().child('users/' + userid).on('value', ((datachild) => {
      this.userProfile = datachild.val();
       console.log(this.userProfile)
      // alert(JSON.stringify(this.userProfile));
      console.log(this.userProfile.firstname)
//      alert(this.userProfile.refferedby);
      if(this.userProfile.refferedby != undefined){
          this.readonly = true;
          this.showtitle = "Referred by"
      } else {
          this.readonly = false;
          this.showtitle = "Add referral code"
      }
      firebase.database().ref().child('Children/' + userid).on('value', ((datachild) => {
        this.childdata = [];

        var childname = []
        var childage = []
        this.child = datachild.val();
        console.log(this.child);
        if (this.child != null) {
          for (var i in this.child.child) {
            this.child.child[i].child_id = i;
            this.childdata.push(this.child.child[i]);
            childname[i] = this.child.child[i].childname
            if(this.child.child[i].childDob != undefined){
               childage[i] = this.child.child[i].childDob
            } else {
               childage[i] = this.child.child[i].duedate
            }
           
          }
        }

        console.log(this.childdata);
        var refferedby = this.userProfile.refferedby
        if(refferedby == undefined){
            refferedby = ''
        }
        this.data = {
          fname: this.userProfile.firstname,
          lname: this.userProfile.lastname,
          childname: childname,
          childAge: childage,
          refcode :  refferedby
        }
        // alert(this.data);
      }))


    }))

    //var data_all = { id: userid }
    var serialized_all = this.serializeObj(this.userProfile);
    //console.log(serialized_all);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options1 = new RequestOptions({ headers: headers });

    this.Loader.dismiss();
  }

  /***************************     End Show profile       *********************/

}


