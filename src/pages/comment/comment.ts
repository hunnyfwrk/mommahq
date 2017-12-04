import { Component } from '@angular/core';
import { NavController,Events, NavParams, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NewsfeedPage } from '../newsfeed/newsfeed';
import { SetPage } from '../set/set';
import { AlertController } from 'ionic-angular';
import { SavediscussionPage } from "../savediscussion/savediscussion";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpModule, Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { NewsfeedProvider } from '../../providers/newsfeed/newsfeed';

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html'
})
export class CommentPage {
  public userid; username; firstname; lastname; msg_id; newsfeeds; image; token; postedby;
  public data = {}; comments: any = 0;  picture = null; like:any ; like_user; base64Image = null;
  currentdate; profilepic;

  objectKeys = Object.keys;


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public newsfeedProvider: NewsfeedProvider,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public navParams: NavParams,
    public http: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public events : Events
  ) {
    //  alert('hh4')
    this.profilepic = localStorage.getItem("userpic");
    console.log(this.profilepic)
    this.events.subscribe('userpic', () => {
      this.profilepic = localStorage.getItem("userpic"); // when user changes her pic
    })
    this.userid = localStorage.getItem('userid');
    this.username = localStorage.getItem('username');
    this.msg_id = this.navParams.get('msg_id');
    var usernamecus = this.username.split(' ');
    this.firstname = usernamecus[0];
    this.lastname = usernamecus[1].substring(0, 1)
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

  ngOnInit() {
    this.getnewsfeed();
   // this.getUser();
  }

  removePic(){
    console.log('removed')
         this.base64Image = null;
         this.picture = null;
  }

  CameraActionSheet() {
    //  this.base64Image = 'https://media.newmindmedia.com/TellUs/image/?file=4F867EEBACA81521EB68140D8EEC87F9BF2856F1.jpg';
    // this.picture =  'https://media.newmindmedia.com/TellUs/image/?file=4F867EEBACA81521EB68140D8EEC87F9BF2856F1.jpg';

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose picture',
      buttons: [ 
        {
          text: 'Camera',
          role: 'camera',
          handler: () => {
            console.log('camera clicked');
            const options: CameraOptions = {
              quality: 25,
              sourceType: 1,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              this.picture = imageData;
              this.base64Image = base64Image;
            }, (err) => {
              // Handle error
            });
          }
        },
        {
          text: 'Gallery',
          role: 'gallery',
          handler: () => {
            console.log('gallery clicked');
            const options: CameraOptions = {
              quality: 25,
              sourceType: 0,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              this.picture = imageData;
              this.base64Image = base64Image;
            }, (err) => {
              // Handle error
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  public getUser(userid) {

    firebase.database().ref().child('users/' + userid).once("value", ((userdata) => {
      console.log(userdata.val());
      if (userdata.val()) {
        if (userdata.val().token) {

          console.log(userdata.val().token)
          this.token = userdata.val().token;
          this.postedby = userid;

        } else {
          console.log('No token found')
        }
      }
    }))


  }

  public getnewsfeed() {
    return new Promise(resolve => {

      firebase.database().ref().child('newsfeed/' + this.msg_id).on('value', ((dataval) => {
        console.log(dataval.val())
        this.newsfeeds = dataval.val();
        this.image = this.newsfeedProvider.imgPath + this.newsfeeds.image;

        console.log('Posted by : ',this.newsfeeds.userid)
        this.getUser(this.newsfeeds.userid)
        firebase.database().ref().child('users').orderByKey().equalTo(this.newsfeeds.userid).once('value', (user) => {
          var users = user.val();
          for (let j in users) {
            if (users[j].lastname) {
              var l = users[j].lastname.substring(0, 1);
              this.newsfeeds.name1 = users[j].firstname + ' ' + l;
            } else {

              this.newsfeeds.name1 = users[j].firstname;
            }
           
            if (users[j].image) {
              this.newsfeeds.userpic = users[j].image;
            } else {
              this.newsfeeds.userpic = 'assets/img/icon2.png';
            }
          }
        })
        var xx: any = dataval.val();
        console.log(xx.comments)
        // if(xx.like != undefined)
        for(var i in this.newsfeeds){
           this.like = xx.like;
           for (var m in this.like) {
                  console.log(this.like[m].user_id)
                  this.like_user = this.like[m].user_id;
            }
        }
        if (xx.comments != undefined) {
          this.comments = xx.comments;
          this.comments = Object.keys(this.comments).map(key => this.comments[key]);
          // console.log('all comments', this.comments.reverse())
            for (let m in this.comments) {
             
              console.log(this.comments[m].image)
              if (this.comments[m].image != undefined || this.comments[m].image != null) {

                console.log(this.comments[m].image)
                this.comments[m].image1 = this.newsfeedProvider.imgPath + this.comments[m].image;
                console.log(this.comments[m].image1)

              }
              console.log(this.comments[m].userid)
              firebase.database().ref().child('users').orderByKey().equalTo(this.comments[m].userid).once('value', (user) => {
                var users = user.val();

                for (let j in users) {
                  if(users[j].lastname){
                    var l = users[j].lastname.substring(0, 1);
                  this.comments[m].name1 = users[j].firstname + ' ' + l;
                  } else {
                  
                  this.comments[m].name1 = users[j].firstname ;
                  }
                  
                  if (users[j].image != undefined) { 
                    console.log(users[j].image)
                    this.comments[m].userpic = users[j].image;
                  } else {
                    console.log(users[j].image)
                    this.comments[m].userpic = 'assets/img/icon1.png';
                  }
                }
              })

              //
               
            }

        }
      })
      )

    })
  }


  public postcomment(formdata) {
    return new Promise(resolve => {
        let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Please wait...'
      });

      
      if (this.picture != null) {

       
        var postdata = {
          image: this.picture
        }
        if(formdata.value.commentdata == undefined || formdata.value.commentdata.trim().length == 0){
          formdata.value.commentdata = '';
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        loading.present().then(()=>{
        this.http.post('http://netin.crystalbiltech.com/mommahq/src/js/controllers/image_upload.php', postdata, options)
          .map(resp => resp.json())
          .subscribe(dataa => {
            loading.dismiss();
           // alert(JSON.stringify(dataa));
            if (dataa.status == 1) {
              var d = new Date();
              firebase.database().ref().child('newsfeed/' + this.msg_id + '/comments').push({
                comment: formdata.value.commentdata,
                username: this.firstname + ' ' + this.lastname,
                userid: this.userid,
                time: d.getTime(),
                image: dataa.name,
              }).then(data => {
                console.log(data);
                this.data = {
                  commentdata: "",
                };
                this.picture = null;
                let toast = this.toastCtrl.create({
                  message: 'Added Successfully',
                  duration: 3000,
                  cssClass: 'toastCss',
                  position: 'bottom',
                });
                toast.present();
                console.log('success');
                 this.base64Image = null;
                 this.sendNotification(this.firstname,this.lastname);
                 firebase.database().ref().child('sweeptakes/' + this.userid + '/' + this.currentdate + '/comment').transaction((values) => {
                   var newValue = (values || 0) + 1;
                   return newValue;
                 })
              }).catch(error => {
                let toast = this.toastCtrl.create({
                  message: 'Error Occured',
                  duration: 3000,
                  cssClass: 'toastCss',
                  position: 'bottom',
                });
                toast.present();

                console.log(error);
                console.log('error');

              });

            } else {
              let toast = this.toastCtrl.create({
                message: 'Error in uploading the image',
                duration: 3000,
                cssClass: 'toastCss',
                position: 'bottom',
              });
              toast.present();
            }
            this.picture = null;
            this.base64Image = null;
          })
        })
   

    //
      } else {
        // formdata.value.commentdata.trim()
   
        if(formdata.value.commentdata != undefined && formdata.value.commentdata.trim().length > 0){
        console.log(formdata.value)
        var d = new Date();
          firebase.database().ref().child('newsfeed/' + this.msg_id + '/comments').push({
            comment: formdata.value.commentdata,
            username: this.firstname + ' ' + this.lastname,
            userid: this.userid,
            time: d.getTime(),
            image: this.picture,
          }).then((res)=>{
              this.sendNotification(this.firstname,this.lastname);
              firebase.database().ref().child('sweeptakes/' + this.userid + '/' + this.currentdate + '/comment').transaction((values) => {
                var newValue = (values || 0) + 1;
                return newValue;
              })
          })
          this.data = {
            commentdata: "",
          }
          this.base64Image = null;
        
      } else {
        this.showtoast('Please write something.');
      }

        //
      }
     


    })
  }



  sendNotification(firstname, lastname) {
    var endpoint = "https://fcm.googleapis.com/fcm/send";
    var fcm_server_key = "AIzaSyBdcK3dV_mF9_dNdvvZTgcgK7VdFcD976A";
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'key=' + fcm_server_key);
    let options1 = new RequestOptions({ headers: headers });

    var data = JSON.stringify({
      "notification": {
        "title": "MommaHQ",  //Any value
        "body": firstname+' ' + lastname+' has commented on "'+this.newsfeeds.newsfeed+'"',  //Any value
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",  //Must be present for Android
        /*"icon":"res://icon/android/icon.png"*/
      },
      "data": {
          "title": "MommaHQ",  //Any value
        "body": firstname+' ' + lastname+' has commented on "'+this.newsfeeds.newsfeed+'"',  //Any value
      },
      "to": this.token, // HERERERERER id
      "priority": "high", //If not set, notification won't be delivered on completely closed iOS app
       "content_available": true
    });

    if (this.userid == this.postedby){
      
    } else {
      this.http.post(endpoint, data, options1).map(res => res.json()).subscribe(data => {
       console.log('data ' + JSON.stringify(data))
      }, error => {
        console.log('err ' + JSON.stringify(error))
      })
    }
  }



  newsfeed() {
    this.navCtrl.push(NewsfeedPage);
  }





  signinpage() {
    this.navCtrl.push(LoginPage);
  }

  heart( status) {
    console.log(this.msg_id,  status);
    firebase.database().ref().child('newsfeed/' + this.msg_id + '/like').orderByChild("user_id").equalTo(this.userid).once('value', ((likedval) => {
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
                firebase.database().ref().child('save_disscuession/' + this.userid).orderByChild("msg_id").equalTo(this.msg_id).once("value", ((res) => {

                  for (var j in res.val()) {
                    console.log(1)
                    firebase.database().ref().child('save_disscuession/' + this.userid + '/' + j).remove()
                      .then((succ) => {
                        console.log(1)
                        firebase.database().ref().child('newsfeed/' + this.msg_id + '/like').orderByChild("user_id").equalTo(this.userid).once("value", ((res1) => {

                          console.log(res1.val())
                          console.log('Im inside');
                          for (let k in res1.val()) {
                            firebase.database().ref().child('newsfeed/' + this.msg_id + '/like/' + k).remove().then((succ) => {

                              this.showtoast('Removed successfully');
                              this.like_user = '';
                              this.getnewsfeed()

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

      } else {
        console.log(this.newsfeeds);
        firebase.database().ref().child('newsfeed/' + this.msg_id + '/like').push({
          user_id: this.userid
        })

        var d = new Date();
        firebase.database().ref().child('save_disscuession/' + this.userid).push({
          msg_id: this.msg_id,
          time: d.getTime(),
        }).then((res) => {
          this.showtoast('Saved successfully');

        })

        firebase.database().ref().child('sweeptakes/' + this.userid + '/' + this.currentdate + '/likes').transaction((values) => {
          var newValue = (values || 0) + 1;
          return newValue;
        })

        // for (var i in this.newsfeeds) {
        //   if (this.newsfeeds[i].message_id == this.msg_id) {
        //     this.newsfeeds[i].likes = 1;
        //   }
        // }
      }
    }))

  }


showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }



}
