import { Component } from '@angular/core';
import { NavController, LoadingController,ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SetPage } from '../set/set';
import { AlertController } from 'ionic-angular';
import { CommentPage } from "../comment/comment";

import { NewsfeedProvider } from '../../providers/newsfeed/newsfeed';


@Component({
  selector: 'page-savediscussion',
  templateUrl: 'savediscussion.html'
})
export class SavediscussionPage {
  objectKeys = Object.keys;
  public userid; username; firstname; lastname; msg_id; image; newsfeeds = [];
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public newsfeedProvider: NewsfeedProvider,
    public toastCtrl : ToastController
  ) {
    // alert('l')
    this.userid = localStorage.getItem('userid');
    this.username = localStorage.getItem('username');
    var usernamecus = this.username.split(' ');
    this.firstname = usernamecus[0];
    this.lastname = usernamecus[1].substring(0, 1)
  }

  ngOnInit() {
    this.getsavediscuess();
    // this.comment();
  }

  public getsavediscuess() {
    this.newsfeeds=[];
    let Loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    Loader.present().then(() => {
      firebase.database().ref().child('save_disscuession/' + this.userid).once('value', ((discuessions) => {

        if (discuessions.val()) {
          Loader.dismiss();
          console.log(discuessions.val());
          var dataval = discuessions.val();

          for (let i in dataval) {
            console.log(dataval[i].msg_id);
            firebase.database().ref().child('newsfeed/' + dataval[i].msg_id).once('value', ((newsfeed) => {
              var msgid = dataval[i].msg_id
              if(newsfeed.val()){

                 this.newsfeeds.push({ [msgid]: newsfeed.val() })
              }
             
            }))
          }
          console.log('here :', this.newsfeeds)
          for (let m in this.newsfeeds) {
            for (let n in this.newsfeeds[m]) {
              if (this.newsfeeds[m][n].image != undefined || this.newsfeeds[m][n].image != null) {

                this.newsfeeds[m][n].image1 = this.newsfeedProvider.imgPath + this.newsfeeds[m][n].image;
                console.log(this.newsfeeds[m][n].image1);
              }
              console.log(this.newsfeeds[m][n].userid)
              let xx = this.newsfeeds[m][n];
              firebase.database().ref().child('users').orderByKey().equalTo(this.newsfeeds[m][n].userid).once('value', (user) => {
                var users = user.val();
                console.log(xx)
                for (let j in users) {
                  console.log(users[j]);
                  // return false;
                  var l = users[j].lastname.substring(0, 1);
                  console.log("honnnyt")
                  console.log(xx)
                  xx.name = users[j].firstname + ' ' + l;
                 if (users[j].image != undefined) { 
                    console.log(users[j].image)
                    xx.userpic = users[j].image;
                  } else {
                    console.log(users[j].image)
                    xx.userpic = 'assets/img/icon1.png';
                  }
                }
              })
               this.newsfeeds[m][n].name = xx.name;
               this.newsfeeds[m][n].userpic = xx.userpic;
            }
          }
        
          this.newsfeeds = Object.keys(this.newsfeeds).map(key => this.newsfeeds[key]) // check this one
          console.log('Array', this.newsfeeds);
          return this.newsfeeds.reverse();

        } else {
          Loader.dismiss();
        }
      })

      )
    })

  }

  
  public comment(msg_id) {
    this.navCtrl.push(CommentPage, {
      msg_id: msg_id,
    });
  }

  newsfeed() {
    this.navCtrl.push(SetPage);
  }




  logout() {
    var aa = this;
    //alert('logout');
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      // alert('success');
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


  search() {
    let alert = this.alertCtrl.create({
      cssClass: 'sunny02',
      title: '<img src="assets/img/search.png" align="left" class="setting-img">Search Button<a><img src="assets/img/close-btn.png" class="close_position"></a>',
      message: 'Enter keyword to search all discussions in the newsfeed',
      subTitle: '',
    });
    alert.present();
  }

  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  heartfun(msg_id) {
    console.log(msg_id)
    // return false;
    firebase.database().ref().child('newsfeed/' + msg_id + '/like').orderByChild("user_id").equalTo(this.userid).once('value', ((likedval) => {
      console.log(likedval.val());

      if (likedval.val()) {
        console.log('Im already saved');
        firebase.database().ref().child('save_disscuession').once('value', ((data) => {
          var all_discussions = data.val()
          console.log(1)
          if (all_discussions) {
            for (var i in all_discussions) {
              console.log(1)
              if (this.userid == i) {
                console.log(1)
                firebase.database().ref().child('save_disscuession/' + this.userid).orderByChild("msg_id").equalTo(msg_id).once("value", ((res) => {

                  for (var j in res.val()) {
                    console.log(1)
                    firebase.database().ref().child('save_disscuession/' + this.userid + '/' + j).remove()
                      .then((succ) => {
                        console.log(1)
                        firebase.database().ref().child('newsfeed/' + msg_id + '/like').orderByChild("user_id").equalTo(this.userid).once("value", ((res1) => {

                          console.log(res1.val())
                          console.log('Im inside');
                          for (let k in res1.val()) {
                            console.log(' M HERERE ', k)
                            firebase.database().ref().child('newsfeed/' + msg_id + '/like/' + k).remove().then((succ) => {

                              this.showtoast('Removed successfully');
                              this.newsfeeds = [];
                              this.getsavediscuess();

                            }).catch((error) => {
                              console.log('ERROR!')
                            })

                          }
                        }))
                      }).catch((err) => {
                        console.log(err)
                      });
                  }
                }))
              }
            }
          }
        }))
      }
    })
    )
  }
}
