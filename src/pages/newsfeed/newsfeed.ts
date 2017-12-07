import { Component, Pipe } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, Events, ModalController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AlertController, } from 'ionic-angular';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LoginPage } from '../login/login';
import { SetPage } from '../set/set';
import { CommentPage } from "../comment/comment";
import { SearchPage } from '../search/search';
import { NewsfeedProvider } from '../../providers/newsfeed/newsfeed';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, Geocoder } from '@ionic-native/google-maps';
import { HttpModule, Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { TutorialPage } from "../tutorial/tutorial";
import { Tutorial2Page } from "../tutorial2/tutorial2";
import { Tutorial3Page } from "../tutorial3/tutorial3";
import { Tutorial4Page } from "../tutorial4/tutorial4"; //
import { Tutorial5Page } from "../tutorial5/tutorial5";
import { Tutorial0Page } from "../tutorial0/tutorial0";
import { SurveymodalPage } from "../surveymodal/surveymodal";

@Component({
  selector: 'page-newsfeed',
  templateUrl: 'newsfeed.html'
})

export class NewsfeedPage {
  [x: string]: any;
  tutorial: any;
  tutorial2: any; tutorial3: any; tutorial4: any; newprofileModal; newpromt;
  searchalert; settingalert; alerttheart; 
  public data = {}; searchdata; postedfrom = 'active_current';
  public newsfeed: any = [];
  public picture = null; profilepic;
  public buttonClicked: boolean = false; errorValue = '2';
  public preserveSnapshot: true; hasKids: boolean = false;
  public firstname; lastname; latitude; longitude; newsfeedData; email; bit; keys; close;
  public news: any = []; active_current: any = "active"; active_home; active_kids;
  public newss: any = []; tracknews: any = []; currentdate;
  public map: GoogleMap; homeaddress: any; currentaddress: any; searchArray; userr_id; testd; dataval;
  public childName = []; public childrenInfo = []; base64Image = null; policy;
  i = 0;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private toastCtrl: ToastController,
    public events: Events,
    public modalCtrl: ModalController,
    public newsfeedProvider: NewsfeedProvider,
    public googleMaps: GoogleMaps,
    public geocoder: Geocoder,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public navParams: NavParams,
    public http: Http,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController
  ) {

    
//   alert("2017-11-30")
    this.profilepic = localStorage.getItem("userpic");
   
    this.events.subscribe('userpic', () => {
      this.profilepic = localStorage.getItem("userpic"); // when user changes her pic
    })
    // this.tutorial4pageModal();
    if (localStorage.getItem('username')) {
      var name = localStorage.getItem('username');
      console.log(name);
      // var startMatch = new RegExp(this.username, "i");
      var sub = name.split(' ');
      console.log(sub[1]);
      this.firstname = sub[0];
      this.lastname = sub[1].substring(0, 1);
      console.log(this.firstname);
      console.log(this.lastname);
    }
    this.events.subscribe('username', ()=>{
        var name = localStorage.getItem('username');
      console.log(name);
      // var startMatch = new RegExp(this.username, "i");
      var sub = name.split(' ');
      console.log(sub[1]);
      this.firstname = sub[0];
      this.lastname = sub[1].substring(0, 1);
      console.log(this.firstname);
      console.log(this.lastname);
    })

    this.email = localStorage.getItem('email');
    this.userr_id = localStorage.getItem('userid');
     if(localStorage.getItem('newpush') == 'yes'){
     // alert('entered')
       this.answer(0);
      localStorage.removeItem('newpush');
    }
    var x = 0;
    this.events.subscribe('newpush', (res) => {
      if (x == 0) {
        this.answer(this.i);
        x = 1;
      }
    })
    // this.answer(this.i);

  //  alert('sunny')
    // alert(JSON.stringify(this.navParams));
    if (this.navParams.get('bit') == '1') {
     // this.checkChildren();
     this.firstTutorial();
    } else {
     this.getnewsfeeds();
    }

    //honey

//  this.firstTutorial();

    // if(localStorage.getItem('seen') != '1'){

    // }

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
    this.findmax();



  }

  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  findmax() {
    var myArray = [{ thismonth: 12, total: 0 }, { thismonth: 10, total: 0 }, { thismonth: 2, total: 0 }];

    const maxValueOfY = Math.max(...myArray.map(o => o.thismonth));
    console.log(maxValueOfY)

    var winner = myArray[Math.floor(Math.random() * myArray.length)]
    console.log(winner)


  }

  /*********function for post new newsfeed ************/
  postnewsfeed(newsfeedval) {
    // alert(this.postedfrom);
    // if (this.postedfrom == 'active_current') {
    //   this.active_current = "active";
    //   this.active_home = "";
    //   this.active_kids = "";
    // } else if (this.postedfrom == 'active_home') {
    //   this.active_current = "";
    //   this.active_home = "active";
    //   this.active_kids = "";
    // } else {
    //   this.active_current = "";
    //   this.active_home = "";
    //   this.active_kids = "active";
    // }
    var d = new Date();


    console.log("i'm clicked");
    // console.log(newsfeedval.value.newsfeed);
    if (localStorage.getItem('userid')) {

      ////////////////////////////
      let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Please wait...'
      });


      loading.present();
      if (this.picture != null) {
        var postdata = {
          image: this.picture,
        }
        if (newsfeedval.value.newsfeed == undefined || newsfeedval.value.newsfeed.trim().length == 0) {
          newsfeedval.value.newsfeed = '';
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://netin.crystalbiltech.com/mommahq/src/js/controllers/image_upload.php', postdata, options)
          .map(resp => resp.json())
          .subscribe(dataa => {
            loading.dismiss();
            // alert(JSON.stringify(dataa));
            var ageGroup: any = localStorage.getItem('age');
            console.log(ageGroup);
            if (ageGroup == undefined || ageGroup == null) {
              ageGroup = 'No age group';
              console.log(ageGroup);
            } 
            
            if (this.latitude == undefined) {
              this.latitude = '';
              this.longitude = '';
            }
            if (dataa.status == 1) {
              if (ageGroup != 'No age group') {
                this.latitude = '';
                this.longitude = '';
                // alert(ageGroup);
              }
              firebase.database().ref('newsfeed/').push({
                newsfeed: newsfeedval.value.newsfeed,
                email: localStorage.getItem('email'),
                userid: localStorage.getItem('userid'),
                name: this.firstname + ' ' + this.lastname,
                latitude: this.latitude,
                longitude: this.longitude,
                image: dataa.name,
                role: 'customer',
                time: d.getTime(),
                ageGroup: ageGroup
              }).then(data => {
                //alert(JSON.stringify(data));
                this.data = {
                  newsfeed: "",
                };
                let toast = this.toastCtrl.create({
                  message: 'Added Successfully',
                  duration: 3000,
                  cssClass: 'toastCss',
                  position: 'bottom',
                });
                toast.present();
                this.base64Image = null;
                console.log('success');
              }).catch(error => {
                let toast = this.toastCtrl.create({
                  message: 'Error Occure',
                  duration: 3000,
                  cssClass: 'toastCss',
                  position: 'bottom',
                });
                toast.present();

                console.log(error);
                console.log('error');

              });

              firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/post').transaction((values) => {
                var newValue = (values || 0) + 1;
                return newValue;
              })

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
      } else {

        loading.dismiss();
        var ageGroup: any = localStorage.getItem('age');
        console.log(ageGroup);
        // if(ageGroup == 'No age group' ||ageGroup == 'Pregnant' ){

        // }
        if (newsfeedval.value.newsfeed != undefined && newsfeedval.value.newsfeed.trim().length > 0) {
          if (ageGroup == undefined || ageGroup == null) {
            ageGroup = 'No age group';
            console.log(ageGroup);
          } else if ( ageGroup > 18 ){
              
            console.log(ageGroup);
          }
          
          
          if (ageGroup != 'No age group') {
            this.latitude = '';
            this.longitude = '';
          }
          if (this.latitude == undefined) {
            this.latitude = '';
            this.longitude = '';
          }
          if( this.active_kids == 'active' && ageGroup == 'No age group'){
              this.showtoast('Please select an age group to post in Kids zone.');
          } else {
          firebase.database().ref('newsfeed/').push({
            newsfeed: newsfeedval.value.newsfeed,
            email: localStorage.getItem('email'),
            userid: localStorage.getItem('userid'),
            name: this.firstname + ' ' + this.lastname,
            latitude: this.latitude,
            longitude: this.longitude,
            image: this.picture,
            role: 'customer',
            time: d.getTime(),
            ageGroup: ageGroup
          }).then(data => {
            console.log(data);
            this.data = {
              newsfeed: "",
            };
            let toast = this.toastCtrl.create({
              message: 'Added Successfully',
              duration: 3000,
              cssClass: 'toastCss',
              position: 'bottom',
            });
            toast.present();


            this.base64Image = null;

            console.log('success');
          }).catch(error => {
            let toast = this.toastCtrl.create({
              message: 'Error Occure',
              duration: 3000,
              cssClass: 'toastCss',
              position: 'bottom',
            });
            toast.present();


            console.log(error);
            console.log('error');

          });
          firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/post').transaction((values) => {
            var newValue = (values || 0) + 1;
            return newValue;
          })
             }
        } else {
          this.showtoast('Please write something.');
        }

      }
    }


  }

  removePic() {
    console.log('removed')
    this.base64Image = null;
    this.picture = null;
  }

  CameraActionSheet() {


   

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
              this.base64Image = base64Image;
              this.picture = imageData;
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
              // alert(this.picture);
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



  location() {
    var aa = this;

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      //  alert(resp.coords.latitude);
      //  alert(resp.coords.longitude);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

    }).catch((error) => {
      console.log('Error getting location', error);
      // alert(error)
      let toast = aa.toastCtrl.create({
        message: 'Please on your location',
        duration: 3000,
        cssClass: 'toastCss',
        position: 'middle',
      });
      toast.present();
      this.diagnostic.switchToLocationSettings();
    });
  }

  /********** function for get newsfeeds***********/
  public getnewsfeeds() {
    localStorage.setItem('age', 'No age group')

    this.active_current = "active";
    this.active_home = "";
    this.active_kids = "";




    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    loading.present().then(() => {

      firebase.database().ref().child('newsfeed/').orderByChild('time').on('value', ((datachild) => {
        this.newss = [];

        loading.dismiss();
        if (this.active_current == "active") {
          //  alert( this.active_current+"//"+this.active_home+"//"+this.active_kids);
          var x = 0;
          console.log(datachild)
          this.newss = [];
          // alert('simer'+ this.newss.length);
          this.news = null;
          this.news = datachild.val();
          console.log(this.news);
          //<<<---    using ()=> syntax
          let options: GeolocationOptions = {
            maximumAge: 3000, timeout: 5000, enableHighAccuracy: false
          };

          var locc = this.newsfeedProvider.getcurrentlatlong(options).loc.then((res) => {

            console.log(res['lat']);
            var response: any = res;
            this.latitude = res['lat'];
            this.longitude = res['lon'];
            this.dataval = [];
            console.log(this.news);
            this.newss = [];
            //  alert('simer1'+ this.newss.length);
            for (let i in this.news) {
              var distance = this.newsfeedProvider.getdistance(this.latitude, this.longitude, this.news[i].latitude, this.news[i].longitude, "K");
              var range = (distance).toFixed(2);
              if (parseFloat(range) < 50.00) {   //gets newsfeed according to current location

                this.news[i].message_id = i;
                if (this.news[i].like != undefined) {

                } else {
                  this.news[i].likes = 0;
                }

                this.newss.push(this.news[i]);
              }
              //gets newsfeed pushed for all users
              if(this.news[i].global != undefined && this.news[i].global ==true){
                  this.newss.push(this.news[i]);
              }
            }
            let timeoutId = setTimeout(() => {
              //console.log(this.newss)

              for (let m in this.newss) {

                firebase.database().ref().child('users').orderByKey().equalTo(this.newss[m].userid).once('value', (user) => {
                  var users = user.val();
                  for (let j in users) {
                    var l = users[j].lastname.substring(0, 1);
                    this.newss[m].name1 = users[j].firstname + ' ' + l;
                    if (users[j].image) {
                      this.newss[m].userpic = users[j].image;
                    } else {
                      this.newss[m].userpic = 'assets/img/icon2.png'
                    }
                  }
                })

                if (this.newss[m].like == undefined) {
                  this.newss[m].likes = 0;
                }
                else {
                  for (var n in this.newss[m].like) {
                    if (this.newss[m].like[n].user_id == this.userr_id) {
                      this.newss[m].likes = 1;
                    } else {
                      this.newss[m].likes = 0;
                    }
                  }
                }
                // console.log(this.newss[m].image)
                if (this.newss[m].image != undefined || this.newss[m].image != null) {
                  this.newss[m].image1 = this.newsfeedProvider.imgPath + this.newss[m].image;
                }

                if (this.newss[m].comments != undefined) {
                  this.newss[m].comments = Object.keys(this.newss[m].comments).map(key => this.newss[m].comments[key]);
                  this.newss[m].count = this.newss[m].comments.length;
                  console.log(this.newss[m].count);
                }
              }

            }, 1000);
            this.currentaddress = {
              latitude: this.latitude,
              longitude: this.longitude,

            }
            var useridd = localStorage.getItem('userid')
            firebase.database().ref().child('/users/' + useridd + '/currentaddress').update(
              this.currentaddress
            ).then(data => {
              console.log('updated');
            }).catch(error => {
              // alert(error);
              loading.dismiss();
            })

          }, err => {

          }).catch((error) => {

            console.log('Error getting location', error);
            let toast = this.toastCtrl.create({
              message: 'Could not fetch location. Make sure your GPS is enabled.',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            loading.dismiss();

          });
        }
      }), err => {
        loading.dismiss()
      })

    })
  }



  setPage() {
    firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
      .equalTo('tutorial5').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() == null) {
          firebase.database().ref().child('liked_status/' + this.userr_id).push({
            tutorial: 'tutorial5'
          })
          this.tutorial5pageModal();
          this.setting();
        } else {
          this.navCtrl.push(SetPage);
        }
      }))
  }

  comment(msg_id) {
    this.navCtrl.push(CommentPage, {
      msg_id: msg_id,
    });
  }

  setting() {
    this.settingalert = this.alertCtrl.create({
      cssClass: 'sunny01 sunny set setting00',
      title: '<img src="assets/img/setting.png" align="left" class="setting-img">Settings Button',
      message: 'Access more info!',
      subTitle: '',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
            if (this.tutorial5 != undefined) {
              this.tutorial5.dismiss();
            }
          }
        },
      ]
    });
    this.settingalert.present();
  }

  search() {
    this.searchalert = this.alertCtrl.create({
      cssClass: 'sunny02 sunny srch',
      title: '<img src="assets/img/search.png" align="left" class="setting-img">Search Button',
      message: 'Enter keyword to search all discussions in the newsfeed',
      subTitle: '',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
            this.tutorial4.dismiss();
          }
        },
      ]
    });
    this.searchalert.present();
  }

  public heart(msg_id, status) {
    console.log(status);
    var user_id = localStorage.getItem("userid");
    firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
      .equalTo('tutorial3').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {
          for (let i in likepopup.val()) {
            console.log(likepopup.val()[i])
            // if (likepopup.val()[i].tutorial == 'tutorial3') {
              firebase.database().ref().child('newsfeed/' + msg_id + '/like').orderByChild("user_id").equalTo(this.userr_id).once('value', ((likedval) => {
                console.log(likedval.val());
                if (likedval.val()) {
                  console.log('Im already saved');
                  firebase.database().ref().child('save_disscuession').once('value', ((data) => {
                    var all_discussions = data.val()
                    console.log(1)
                    if (all_discussions) {
                      for (var i in all_discussions) {
                        console.log(1)
                        if (this.userr_id == i) {
                          console.log(1)
                          firebase.database().ref().child('save_disscuession/' + this.userr_id).orderByChild("msg_id").equalTo(msg_id).once("value", ((res) => {

                            for (var j in res.val()) {
                              console.log(1)
                              firebase.database().ref().child('save_disscuession/' + this.userr_id + '/' + j).remove()
                                .then((succ) => {
                                  console.log(1)
                                  firebase.database().ref().child('newsfeed/' + msg_id + '/like').orderByChild("user_id").equalTo(this.userr_id).once("value", ((res1) => {

                                    console.log(res1.val())
                                    console.log('Im inside');
                                    for (let k in res1.val()) {
                                      console.log(' M HERERE ', k)
                                      firebase.database().ref().child('newsfeed/' + msg_id + '/like/' + k).remove().then((succ) => {

                                        this.showtoast('Removed successfully');
                                        // this.active_current = "active";
                                        // this.active_home = "";
                                        // this.active_kids = "";

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
                  console.log(this.newss);
                  firebase.database().ref().child('newsfeed/' + msg_id + '/like').push({
                    user_id: user_id
                  })

                  var d = new Date();
                  firebase.database().ref().child('save_disscuession/' + this.userr_id).push({
                    msg_id: msg_id,
                    time: d.getTime(),
                  }).then((res) => {
                    this.showtoast('Saved successfully');
                    // this.active_current = "active";
                    // this.active_home = "";
                    // this.active_kids = "";
                  })

                  firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/likes').transaction((values) => {
                    var newValue = (values || 0) + 1;
                    return newValue;
                  })

                  for (var i in this.newss) {
                    if (this.newss[i].message_id == msg_id) {
                      this.newss[i].likes = 1;
                    }
                  }
                }

                //
              })
              )

            // } else {

            //   this.tutorial3pageModal();
            //   let alertt = this.alertCtrl.create({
            //     cssClass: 'sunny01 ggg sunny last1 hrt',
            //     title: '<img src="assets/img/heart1.png" align="left" class="setting-img">Save Discussions',
            //     message: 'Click the heart next to a post to save the discussion and access them anytime without having to scroll through the newsfeed.',
            //     subTitle: '',
            //     buttons: [
            //       {
            //         text: 'X',
            //         role: 'cancel',
            //         cssClass: 'close_position',
            //         handler: data => {
            //           console.log('Cancel clicked');
            //           if (this.tutorial3 != undefined) {
            //             this.tutorial3.dismiss();
            //           }
            //           this.setPage();
            //         }
            //       },
            //     ]
            //   });
            //   alertt.present();
            //   firebase.database().ref().child('liked_status/' + this.userr_id).push({
            //     tutorial: 'tutorial3'
            //   })
            //   console.log(msg_id)
            // }
          }
        } else {
          this.tutorial3pageModal();
          console.log('HEART')
          this.alerttheart = this.alertCtrl.create({
            cssClass: 'sunny01 ggg sunny last1 hrt',
            title: '<img src="assets/img/heart1.png" align="left" class="setting-img">Save Discussions',
            message: 'Click the heart next to a post to save the discussion and access them anytime without having to scroll through the newsfeed',
            subTitle: '',
            buttons: [
              {
                text: 'X',
                role: 'cancel',
                cssClass: 'close_position',
                handler: data => {
                  console.log('Cancel clicked');
                  if (this.tutorial3 != undefined) {
                    this.tutorial3.dismiss();
                  }
                   this.setPage();
                }
              },
            ]
          });
          this.alerttheart.present();
          firebase.database().ref().child('liked_status/' + this.userr_id).push({
            tutorial: 'tutorial3'
          })
          console.log(msg_id)

        }
      }))
  }




  /****************** popup for kid zone */
  kidzone() {
    // this.childName = [];	
    this.active_current = "";
    this.active_home = "";
    this.active_kids = "active";

    firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
      .equalTo('tutorial').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());

        if (likepopup.val() == null) {
          firebase.database().ref().child('liked_status/' + this.userr_id).push({
            tutorial: 'tutorial'
          })
          this.tutorialpageModal();
          let timeoutId = setTimeout(() => {
            prompt.present();
          }, 500)
        } else {
          prompt.present();
        }
      }))

    let prompt = this.alertCtrl.create({
      title: 'Kids Zone',
      message: "Enter your child's name and age to chat with other moms with kids the same age as yours",
      cssClass: 'sunny01 ggg sunny last1 kids_zone',
      inputs: [
        {
          name: 'fchildname',
          placeholder: "Child's name"
        },
        {
          name: 'date',
          placeholder: 'Birth date',
          type: 'date'
        },
      ],
      buttons: [
       
        {
          text: 'Add to profile',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.fchildname);
            console.log(data.date);
            if (data.fchildname != '' && data.date != '') {
              var user = firebase.auth().currentUser;
              var age = this.newsfeedProvider.getAge(data.date);
              var yr = data.date.split('-');
              var ageGroup = yr[0];
              let useridd = localStorage.getItem('userid');
              let email = localStorage.getItem('email');
              console.log(age, 'age')

              if (age < 18) {

              }
                firebase.database().ref().child('Children/' + useridd + "/child").push({
                  childname: data.fchildname,
                  childDob: data.date,
                  childAge: age,
                  userid: useridd,
                  useremail: email
                }).then(val => {

                  firebase.database().ref().child('Children/').orderByKey().on('value', ((childrens) => {
                    if (this.active_kids == "active") {
                      var children = childrens.val();
                      var trackval = [];
                      var tracknews = [];
                      this.newss = [];
                      for (var i in children) {
                        for (var j in children[i]) {
                          // console.log(i)
                          //  console.log(children[i][j])
                          for (var k in children[i][j]) {
                            if (children[i][j][k].childAge < age) {
                              if (trackval.indexOf(i) == -1) {
                                trackval.push(i);
                                firebase.database().ref().child('newsfeed').orderByChild("userid").equalTo(i).once("value", ((nwss) => {
                                  if (nwss.val()) {
                                    var newsfeed = nwss.val()
                                    ///
                                    for (var l in newsfeed) {
                                      // console.log(newsfeed[l]);
                                      if (newsfeed[l].ageGroup != undefined) {
                                        var agelimits = newsfeed[l].ageGroup;
                                        // console.log(agelimits)
                                         console.log(ageGroup)
                                        if (JSON.stringify(agelimits) == JSON.stringify(ageGroup)) {
                                          if (tracknews.indexOf(l) == -1) {
                                            tracknews.push(l);
                                            newsfeed[l].message_id = l;
                                            this.newss.push(newsfeed[l]);

                                          }
                                          // console.log('Match')
                                        } else {
                                          // console.log('Not a match')
                                        }

                                      }
                                    }
                                    ///
                                  }
                                })
                                )
                              }
                            }
                          }
                        }
                      }
                      let timeoutId = setTimeout(() => {
                        console.log('NEWSFEED', this.newss)
                        for (let m in this.newss) {
                          if (this.newss[m].like == undefined) {
                            this.newss[m].likes = 0;
                          }
                          else {
                            for (var n in this.newss[m].like) {
                              if (this.newss[m].like[n].user_id == this.userr_id) {
                                this.newss[m].likes = 1;
                              } else {
                                this.newss[m].likes = 0;
                              }

                            }
                          }
                          console.log(this.newss[m].image)
                          if (this.newss[m].image != undefined || this.newss[m].image != null) {

                            console.log(this.newss[m].image)
                            this.newss[m].image1 = this.newsfeedProvider.imgPath + this.newss[m].image;
                            console.log(this.newss[m].image1)

                          }

                          if (this.newss[m].comments != undefined) {
                            this.newss[m].comments = Object.keys(this.newss[m].comments).map(key => this.newss[m].comments[key]);
                            this.newss[m].count = this.newss[m].comments.length;
                            console.log(this.newss[m].count);
                          }
                          firebase.database().ref().child('users').orderByKey().equalTo(this.newss[m].userid).once('value', (user) => {
                            var users = user.val();
                            for (let j in users) {
                              var last = users[j].lastname.substring(0, 1);
                              this.newss[m].name1 = users[j].firstname + ' ' + last;
                              if (users[j].image) {
                                this.newss[m].userpic = users[j].image;
                              } else {
                                this.newss[m].userpic = 'assets/img/icon2.png'
                              }
                            }
                            console.log(this.newss[m].name1)
                          })
                        }
                      }, 1000);
                      console.log(this.newss)
                    }
                  })
                  )
                  this.addchild(data.fchildname);
                }).catch(error => {
                  // alert(error);
                })
             // } if part ends for age < 18 
              // else {
              //   let toast = this.toastCtrl.create({
              //     message: 'Please add children under 18 years of age only.',
              //     duration: 3000,
              //     position: 'bottom'
              //   });
              //   toast.present();
              // }
            } else {
              let toast = this.toastCtrl.create({
                message: 'Please fill in all the fields.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              if (this.tutorial != undefined) {
                this.tutorial.dismiss().catch(() => {
                  console.log('no tuturial was called')
                })
              }
            }
          }
        }, {
          text: 'Pregnant?',
          cssClass: 'merabutton',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.fchildname);
            this.bit = '';
            this.bit = 'active';
            this.pregnant();
            if (this.tutorial != undefined) {
              this.tutorial.dismiss().catch(() => {
                console.log('no tuturial was called')
              })
            }
          }
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            this.active_current = "";
            this.active_home = "";
            this.active_kids = "";
            console.log('Cancel clicked');
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial4').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                  this.searchbar();
                  // this.getlocation();
                } else {
                  this.active_current = "";
                  this.active_home = "";
                  this.active_kids = "active";
                }
              }))
            // to know that the tutorial has been seen
            if (this.tutorial != undefined) {
              this.tutorial.dismiss().catch(() => {
                console.log('no tuturial was called')
              })
            }

          }
        },
      ],
    });
  }


  /****************** popup for kid zone */
  addchild(fchildname) {
    let prompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: 'Kids Zone',
      message: fchildname + " has been added!",
      cssClass: 'sunny01 ggg sunny add',
      buttons: [

         {
           text: 'Add Another Child',
           handler: data => {
             console.log('Saved clicked');
             console.log(data);
             this.kidzone();
           }
         },
        {
          text: 'Done',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
            this.hasKids = true;
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial4').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                  // this.getlocation();
                   this.searchbar();
                }
              }))
          },
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
            this.hasKids = true;
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial4').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                  // this.getlocation();
                  this.searchbar();
                }
              }))
          }
        },

      ],


    });
    prompt.present();
  }

  /***********************Popup for add child of pregnant ***********/
  pregnant() {
    let useridd = localStorage.getItem('userid');
      let email = localStorage.getItem('email');
    let prompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: 'Kids Zone',
      message: "Pregnant?<br />Enter your due date to chat with other expecting moms!",
      cssClass: 'sunny01 ggg sunny',
      inputs: [
        {
          name: 'fchildname',
          placeholder: 'New baby'
        },
        {
          name: 'date',
          placeholder: 'Expected date of delivery',
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Add to profile',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.fchildname);
            console.log(data.date);
            var age:any = this.newsfeedProvider.getMonths(data.date);
                age = "-0."+age
            var days = this.newsfeedProvider.get_days(data.date)
           // alert(age)
            console.log(days);
      
            if (data.fchildname != '' && data.date != '') {
              if (days > 0) {
                var user = firebase.auth().currentUser;
              
              
                firebase.database().ref().child('Children/' + useridd + "/child").push({
                  childname: data.fchildname,
                  childAge: age,
                  duedate: data.date,
                  userid: useridd,
                  useremail: email,
                  status: 'pregnant'
                }).then(data => {
                  this.due();
                }).catch(error => {
                  //alert(error);
                })

              } else {
                let toast = this.toastCtrl.create({
                  message: 'Due date cannot be prior to current date.',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
              }

            } else {
              let toast = this.toastCtrl.create({
                message: 'Please fill in all the fields.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              if (this.tutorial != undefined) {
                this.tutorial.dismiss().catch(() => {
                  console.log('no tuturial was called')
                });
              }
            }
          }
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial4').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                  this.searchbar();
                }
              }))
          }
        },

      ],


    });
    prompt.present();
  }

  due() {
    let prompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: 'Kids Zone',
      message: "Your due date has been added!",
      cssClass: 'sunny01 ggg sunny add',
      buttons: [
        {
          text: 'Add Another Child',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
            this.pregnant();
          }
        },
        {
          text: 'Done',
          handler: data => {
            console.log('Saved clicked');
            this.hasKids = true;
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial4').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                  this.searchbar();
                }
              }))

          },
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
            this.hasKids = true;
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial4').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                  // this.getlocation();
                  this.searchbar();
                }
              }))
          }
        },

      ],


    });
    prompt.present();
  }


  // hasKids() {

  //   var id = localStorage.getItem('userid');
  //   firebase.database().ref().child('Children/' + id + '/child').once("value", ((children) => {
  //     console.log(children.val());
  //     if (children.val()) {

  //     } else {
  //       this.kidzone();
  //     }
  //   }))
  //      this.getnewsfeeds();

  // }
  checkChildren() {
    this.active_current = "active";
    this.active_home = "";
    this.active_kids = "";
    this.childrenInfo = [];
    var id = localStorage.getItem('userid');
    console.log(id)
    firebase.database().ref().child('Children/' + id + '/child').once("value", ((children) => {
      if (children.val()) {
        this.hasKids = true;
        var allkids = children.val();
        // this.childrenInfo = allkids;
        console.log('children', allkids);

        // for (var kid in allkids) {
        //   console.log(allkids[kid].childAge)
        //   var ageGroup = allkids[kid].childAge;
        //   if (ageGroup < 0) {
        //     allkids[kid].ageGroup = 'Pregnant'
        //     console.log(allkids[kid].ageGroup);
        //   } else if ((ageGroup > 0) && (ageGroup < 5)) {
        //     allkids[kid].ageGroup = '0-5';
        //     console.log(allkids[kid].ageGroup);
        //   } else if ((ageGroup > 5) && (ageGroup < 10)) {
        //     allkids[kid].ageGroup = '5-10';
        //     console.log(allkids[kid].ageGroup);
        //   } else if ((ageGroup > 10) && (ageGroup < 15)) {
        //     allkids[kid].ageGroup = '10-15';
        //     console.log(allkids[kid].ageGroup);;
        //   } else if ((ageGroup > 15) && (ageGroup < 18)) {
        //     allkids[kid].ageGroup = '15-18'
        //     console.log(allkids[kid].ageGroup);;
        //   } else {
        //   //  allkids[kid].ageGroup = 'No age group';
        //   }
        // }
        for (var kid in allkids) {

          this.childrenInfo.push(allkids[kid]);
        }

        var prompt = this.alertCtrl.create({
          // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
          title: 'Kids Zone',
          subTitle: 'Which age group do you want to talk to?',
          cssClass: 'sunny01 ggg sunny last1',
          buttons: [{
            text: 'X',
            role: 'cancel',
            cssClass: 'close_position',
            handler: data => {
              console.log('Cancel clicked');
            }
          }],
        });
        console.log(this.childrenInfo.length)
        for (let i = 0; i < this.childrenInfo.length; i++) {

          console.log(this.childrenInfo[i].childname)
           var childDob = this.childrenInfo[i].childDob.split('-');
              console.log(childDob[0]);
              this.childrenInfo[i].birthyear = childDob[0];
          prompt.addButton(
            {
              text: this.childrenInfo[i].childname,// + ' (' + this.childrenInfo[i].ageGroup + ')',
              handler: data => {
                console.log(this.childrenInfo[i].childAge);
                localStorage.setItem('age', this.childrenInfo[i].birthyear) //childAge
                this.feedAccToAge(this.childrenInfo[i].ageGroup)
              }
            });
        }
        prompt.addButton({
          text: 'Add another child',
          cssClass: 'merabutton',
          handler: data => {
            console.log('Saved clicked');
            this.kidzone();
          }
        })
        if (localStorage.getItem('seen') == '1') {

        } else {
          localStorage.setItem('seen', '1');
          prompt.present();
        }

      } else {
        this.kidzone();
        this.hasKids = false;
      }
    }))

  }

 
  tutorial2pageModal() {  // home base
    this.tutorial2 = this.modalCtrl.create(Tutorial2Page);
    this.tutorial2.present();
  }
   tutorialpageModal() {   // Kidzone
    this.tutorial = this.modalCtrl.create(TutorialPage);
    this.tutorial.present();
  }
   tutorial4pageModal() {  //search
    this.tutorial4 = this.modalCtrl.create(Tutorial4Page);
    this.tutorial4.present();
    this.tutorial4.onDidDismiss(res => {
      this.searchalert.dismiss();
      firebase.database().ref().child('liked_status/' + this.userr_id).push({
                tutorial: 'tutorial4'
      })
      this.heart('', '');
     
    })
  }

  tutorial3pageModal() {  // heart
    this.tutorial3 = this.modalCtrl.create(Tutorial3Page);
    this.tutorial3.present();
    this.tutorial3.onDidDismiss(res => {
      this.alerttheart.dismiss();
      this.setPage();
    })
  }
 
  tutorial5pageModal() {
    this.tutorial5 = this.modalCtrl.create(Tutorial5Page);
    this.tutorial5.present();

    this.tutorial5.onDidDismiss(res => {
      this.settingalert.dismiss();
      this.navCtrl.push(SetPage);
    })
  }


  last() {
    this.newss = [];
    this.active_current = "";
    this.active_home = "";
    this.active_kids = "active";
    this.childrenInfo = [];
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });


    var id = localStorage.getItem('userid');
    console.log(id)
    loading.present().then(() => {
      firebase.database().ref().child('Children/' + id + '/child').once("value", ((children) => {
        console.log(children.val());
        if (children.val()) {
          var allkids = children.val();
          // this.childrenInfo = allkids;
          console.log('children', allkids);
          for (var kid in allkids) {
               var ageGroup = allkids[kid].childAge;
             if (ageGroup > 18 ) {
              allkids[kid].ageGroup = 'Above 18'
              console.log(allkids[kid].ageGroup);
            } 
            this.childrenInfo.push(allkids[kid]);
          }
          console.log('list with ageGroup: ' + JSON.stringify(this.childrenInfo));
          var prompt = this.alertCtrl.create({
            // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
            title: 'Kids Zone',
            subTitle: 'Which age group do you want to talk to?',
            cssClass: 'sunny01 ggg sunny last1',
            buttons: [{
              text: 'X',
              role: 'cancel',
              cssClass: 'close_position',
              handler: data => {
                console.log('Cancel clicked');
                if (this.tutorial != undefined) {
                  this.tutorial.dismiss().catch(() => {
                    console.log('no tuturial was called')
                  });
                }

                loading.dismiss();

              }
            }],
          });
          console.log(this.childrenInfo.length)
          for (let i = 0; i < this.childrenInfo.length; i++) {

              console.log(this.childrenInfo[i].childDob);
              console.log(this.childrenInfo[i].ageGroup);
              if (this.childrenInfo[i].childDob != undefined) {
                if (this.childrenInfo[i].ageGroup == 'Above 18') {
                    this.childrenInfo[i].birthyear = 'Above 18'
                } else {
                  var childDob = this.childrenInfo[i].childDob.split('-');
                  console.log(childDob[0]);
                  this.childrenInfo[i].birthyear = childDob[0];
                }

              } else {
                var childDob = this.childrenInfo[i].duedate.split('-');
                console.log(childDob[0]);
                this.childrenInfo[i].birthyear = childDob[0];
              }
           
            
            prompt.addButton(
              {
                text: this.childrenInfo[i].childname + ' ('+ this.childrenInfo[i].birthyear +')' ,  
                //+ ' (' + this.childrenInfo[i].ageGroup + ')',
                handler: data => {
                  console.log(this.childrenInfo[i].birthyear); // childAge
                  localStorage.setItem('age', this.childrenInfo[i].birthyear);
                  this.feedAccToAge(this.childrenInfo[i].birthyear);//this.childrenInfo[i].ageGroup);
                  if (this.tutorial != undefined) {
                    this.tutorial.dismiss().catch(() => {
                      console.log('no tuturial was called')
                    });
                  }
                }
              });
          }
          prompt.addButton({
            text: 'Add another child',
            cssClass: 'merabutton',
            handler: data => {
              console.log('Saved clicked');
              this.kidzone();
              if (this.tutorial != undefined) {
                this.tutorial.dismiss().catch(() => {
                  console.log('no tuturial was called')
                });
              }
            }
          })
          prompt.present();
          this.hasKids = true;
          loading.dismiss();
        } else {
          this.kidzone();
          this.hasKids = false;
          loading.dismiss();
        }
      }))
    })

  }

  feedAccToAge(ageGroup) {
    this.hasKids = true;
    console.log(ageGroup)
    this.active_current = "";
    this.active_home = "";
    this.active_kids = "active";
    // this.postedfrom = 'active_kids'

    firebase.database().ref().child('newsfeed').on("value", ((nwss) => {
      if (this.active_kids == "active") {

        var trackval = [];
        var tracknews = [];
        this.newss = [];
        if (nwss.val()) {
          var newsfeed = nwss.val()

          for (var l in newsfeed) {
            // console.log(newsfeed[l]);
            if (newsfeed[l].ageGroup != undefined) {
              var agelimits = newsfeed[l].ageGroup;
// var ageGroup = yr[0];
              // console.log(agelimits)
              // console.log(ageGroup)
              if (JSON.stringify(agelimits) == JSON.stringify(ageGroup)) {
                if (tracknews.indexOf(l) == -1) {
                  tracknews.push(l);
                  newsfeed[l].message_id = l;
                  this.newss.push(newsfeed[l]);

                }
              } else {
                // console.log('Not a match')
              }
            }
            if(newsfeed[l].global != undefined && newsfeed[l].global ==true){
                if (tracknews.indexOf(l) == -1) {
                  tracknews.push(l);
                  newsfeed[l].message_id = l;
                  this.newss.push(newsfeed[l]);
                }
            } 
          }
        }

        let timeoutId = setTimeout(() => {
          for (let m in this.newss) {
            if (this.newss[m].like == undefined) {
              this.newss[m].likes = 0;
            }
            else {
              for (var n in this.newss[m].like) {
                if (this.newss[m].like[n].user_id == this.userr_id) {
                  this.newss[m].likes = 1;
                } else {
                  this.newss[m].likes = 0;
                }
              }
            }
            console.log(this.newss[m].image)
            if (this.newss[m].image != undefined || this.newss[m].image != null) {

              console.log(this.newss[m].image)
              this.newss[m].image1 = this.newsfeedProvider.imgPath + this.newss[m].image;
              console.log(this.newss[m].image1)

            }

            if (this.newss[m].comments != undefined) {
              this.newss[m].comments = Object.keys(this.newss[m].comments).map(key => this.newss[m].comments[key]);
              this.newss[m].count = this.newss[m].comments.length;
              console.log(this.newss[m].count);
            }
            firebase.database().ref().child('users').orderByKey().equalTo(this.newss[m].userid).once('value', (user) => {
              var users = user.val();
              for (let j in users) {
                var last = users[j].lastname.substring(0, 1);
                this.newss[m].name1 = users[j].firstname + ' ' + last;
                if (users[j].image) {
                  this.newss[m].userpic = users[j].image;
                } else {
                  this.newss[m].userpic = 'assets/img/icon2.png'
                }
              }
              console.log(this.newss[m].name1)
            })
          }
          // this.postedfrom = '';
        }, 1000);

        console.log(this.newss)
      }
    })
    )





  }
  signinpage() {
    this.navCtrl.push(LoginPage);
  }


  


  getlocation() {
    localStorage.setItem('age', 'No age group')
    this.active_current = "";
    this.active_home = "active";
    this.active_kids = "";
    // this.postedfrom = 'active_home'
    let prompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: 'Home Base',
      message: "Set your home base location to chat with moms near your home town",
      cssClass: 'sunny01 ggg sunny homebase location1',
      inputs: [
        {
          type: 'number',
          name: 'zipcode',
          placeholder: 'Enter Zip-code'
        },
      ],
      buttons: [
        {
          text: 'Set Location',
          handler: data => {
            console.log('Saved clicked');
            // this.bit = '';
            //this.bit = 'active';
            console.log(data.zipcode);
            if (this.tutorial2 != undefined) {
              this.tutorial2.dismiss();
            }

            if (data.zipcode != '') {

              var baseurl = 'https://maps.googleapis.com/maps/api/geocode/json?address='
              //  this.geocoder.geocode({ 'address': data.zipcode }).then((result) => {
              this.http.get(baseurl + data.zipcode)
                .map(res => res.json())
                .subscribe(result => {
  
                  console.log(result.results[0])
  
               
                  if (result.status == 'OK') {
                    console.log('BUTTON CLICKED2')
                    this.homeaddress = {
                      latitude: result.results[0].geometry.location.lat,
                      longitude: result.results[0].geometry.location.lng,
                      address: result.results[0].formatted_address,
                      zip: data.zipcode,
                    }
                  // alert(JSON.stringify(this.homeaddress));
                  // var user = firebase.auth().currentUser;
                  var useridd = localStorage.getItem('userid');
                  // console.log(user.uid);
                  ///////////////////////////////

                  /////////////////////////////////
                  firebase.database().ref().child('/users/' + useridd + '/homeaddress').update(
                    this.homeaddress).then(data => {
                      console.log('updated');
                      this.showtoast('Home base has been updated');
                    }).catch(error => {
                      this.showtoast('Error updating homebase');
                    })

                  firebase.database().ref().child('newsfeed').orderByKey().on('value', ((datachild) => {
                    if (this.active_home == "active") {
                      this.newss = [];
                      this.dataval = []
                      this.news = datachild.val();
                      this.latitude = result.results[0].geometry.location.lat;
                      this.longitude = result.results[0].geometry.location.lng;
                      
                      for (let i in this.news) {
                        //  console.log(this.news[i]);
                        var distance = this.newsfeedProvider.getdistance(this.latitude, this.longitude, this.news[i].latitude, this.news[i].longitude, "K");

                        var range = (distance).toFixed(2);
                        if (parseFloat(range) < 50.00) {

                          // image and comment
                          if (this.news[i].image != undefined || this.news[i].image != null) {
                            this.news[i].image1 = this.newsfeedProvider.imgPath + this.news[i].image;
                          }

                          if (this.news[i].comments != undefined) {
                            this.news[i].comments = Object.keys(this.news[i].comments).map(key => this.news[i].comments[key]);
                            this.news[i].count = this.news[i].comments.length;
                           // console.log(this.news[i].count);
                          }

                          this.news[i].message_id = i;

                          if (this.news[i].like != undefined) {
                            console.log(i)
                            this.dataval.push(i);
                            var j = 0;
                            firebase.database().ref().child('newsfeed/' + i + '/like').orderByChild("user_id").equalTo(this.userr_id).once('value', ((userlike) => {
                             // console.log(userlike.val());
                              var userlikes = userlike.val();
                              if (userlikes) {
                                this.news[this.dataval[j]].likes = 1;
                               // console.log("sd" + this.testd);
                              } else {
                                this.news[this.dataval[j]].likes = 0;
                              }
                              j++
                            })
                            )
                          } else {
                            this.news[i].likes = 0;
                          }



                          // user's name
                          firebase.database().ref().child('users').orderByKey().equalTo(this.news[i].userid).once('value', (user) => {
                            var users = user.val();
                            for (let j in users) {
                              var l = users[j].lastname.substring(0, 1);
                              this.news[i].name1 = users[j].firstname + ' ' + l;
                              if (users[j].image) {
                                this.news[i].userpic = users[j].image;
                              } else {
                                this.news[i].userpic = 'assets/img/icon2.png'
                              }
                            }
                          })
                          //

                          this.newss.push(this.news[i]);
                          console.log(this.newss);
                        }
                      }
                      firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
                        .equalTo('tutorial').once('value', ((likepopup) => {
                          console.log(' Liked status ', likepopup.val());
                          if (likepopup.val() == null) {
                            // this.searchbar()
                            this.checkChildren();
                          }
                        }))
                    }
                  })
                  )
                } else {
                  this.showtoast('Could not find the location associated with the zipcode');
                }
              })
            } else {
              let toast = this.toastCtrl.create({
                message: 'Please fill in all the  fields.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();

              if (this.tutorial2 != undefined) {
                this.tutorial2.dismiss();
              }
            }

            //
          }
        },
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
            console.log('Cancel clicked');
            firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
              .equalTo('tutorial').once('value', ((likepopup) => {
                console.log(' Liked status ', likepopup.val());
                if (likepopup.val() == null) {
                   this.checkChildren();
                  // this.searchbar()
                }
              }))
            if (this.tutorial2 != undefined) {
              this.tutorial2.dismiss();
            }
          }
        },
      ],
    });

    firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
      .equalTo('tutorial2').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {

          //prompt.present();
          //call a function
          var useridd = localStorage.getItem('userid');
          firebase.database().ref().child('/users/' + useridd + '/homeaddress').once('value', (res) => {
            console.log(res.val());
            if (res.val()) {
              var lat = res.val().latitude;
              var long = res.val().longitude;
              var zip = res.val().zip;
              this.homebaselocation(lat, long, zip);
            } else {

              prompt.present();
            }
          })


        } else {
          this.tutorial2pageModal()

          firebase.database().ref().child('liked_status/' + this.userr_id).push({
            tutorial: 'tutorial2'
          })
          prompt.present();
        }
      }
      ))

  }


//get newsfeed according to zip code
  homebaselocation(lat, long, zip) {
    console.log(lat, long, zip)
    var loader = this.loadingCtrl.create({
      content: 'Loading...',
      spinner: 'dots',
    })
    
    // this.geocoder.geocode({ 'address': zip }).then((result) => {

    //   if (Object.keys(result).length > 0) {
        loader.present()
        var useridd = localStorage.getItem('userid');
        this.newss = [];
        firebase.database().ref().child('newsfeed').orderByKey().on('value', ((datachild) => {
          console.log('honey');
       
          if (this.active_home == "active") {
            this.newss = [];
            this.dataval = []
            this.news = datachild.val();
     
            this.latitude = lat;//result[0].position.lat;
            this.longitude = long;//result[0].position.lng;
            loader.dismiss()
            console.log(this.news);
            if (this.news) {
                  
              for (let i in this.news) {
                var distance = this.newsfeedProvider.getdistance(this.latitude, this.longitude, this.news[i].latitude, this.news[i].longitude, "K");

                var range = (distance).toFixed(2);
                loader.dismiss()
                if (parseFloat(range) < 50.00) { //gets newsfeed according to homebase
                  console.log('honey3');
                  // image and comment
                  if (this.news[i].image != undefined || this.news[i].image != null) {
                    this.news[i].image1 = this.newsfeedProvider.imgPath + this.news[i].image;
                  }

                  if (this.news[i].comments != undefined) {
                    this.news[i].comments = Object.keys(this.news[i].comments).map(key => this.news[i].comments[key]);
                    this.news[i].count = this.news[i].comments.length;
                    console.log(this.news[i].count);
                  }

                  this.news[i].message_id = i;

                  if (this.news[i].like != undefined) {
                   // console.log(i)
                    this.dataval.push(i);
                    var j = 0;
                    firebase.database().ref().child('newsfeed/' + i + '/like').orderByChild("user_id").equalTo(this.userr_id).once('value', ((userlike) => {
                     // console.log(userlike.val());
                      var userlikes = userlike.val();
                      if (userlikes) {
                        this.news[i].likes = 1;
                      //  console.log("sd" + this.testd);
                      } else {
                        this.news[i].likes = 0;
                      }
                      j++
                    })
                    )
                  } else {
                    this.news[i].likes = 0;
                  }
                  console.log(this.news);
                  firebase.database().ref().child('users').orderByKey().equalTo(this.news[i].userid).once('value', (user) => {
                    var users = user.val();
                    for (let j in users) {
                      var l = users[j].lastname.substring(0, 1);
                      this.news[i].name1 = users[j].firstname + ' ' + l;
                      if (users[j].image) {
                        this.news[i].userpic = users[j].image;
                      } else {
                        this.news[i].userpic = 'assets/img/icon2.png'
                      }
                    }
                  })
                  //
                  this.newss.push(this.news[i]);
                }
                
                //gets newsfeed pushed for all users
                if(this.news[i].global != undefined && this.news[i].global ==true){
                    // image and comment
                  if (this.news[i].image != undefined || this.news[i].image != null) {
                    this.news[i].image1 = this.newsfeedProvider.imgPath + this.news[i].image;
                  }

                  if (this.news[i].comments != undefined) {
                    this.news[i].comments = Object.keys(this.news[i].comments).map(key => this.news[i].comments[key]);
                    this.news[i].count = this.news[i].comments.length;
                    console.log(this.news[i].count);
                  }

                  this.news[i].message_id = i;

                  if (this.news[i].like != undefined) {
                   // console.log(i)
                    this.dataval.push(i);
                    var j = 0;
                    firebase.database().ref().child('newsfeed/' + i + '/like').orderByChild("user_id").equalTo(this.userr_id).once('value', ((userlike) => {
                     // console.log(userlike.val());
                      var userlikes = userlike.val();
                      if (userlikes) {
                        this.news[i].likes = 1;
                      //  console.log("sd" + this.testd);
                      } else {
                        this.news[i].likes = 0;
                      }
                      j++
                    })
                    )
                  } else {
                    this.news[i].likes = 0;
                  }
                  console.log(this.news);
                  firebase.database().ref().child('users').orderByKey().equalTo(this.news[i].userid).once('value', (user) => {
                    var users = user.val();
                    for (let j in users) {
                      var l = users[j].lastname.substring(0, 1);
                      this.news[i].name1 = users[j].firstname + ' ' + l;
                      if (users[j].image) {
                        this.news[i].userpic = users[j].image;
                      } else {
                        this.news[i].userpic = 'assets/img/icon2.png'
                      }
                    }
                  })
                    this.newss.push(this.news[i]);
                }
              }
            }
          }
        })
        )
      // }
    // }).catch(() => {
    //   loader.dismiss()
    // })

  }

  test() {
    alert("sfcdsx")
  }

  answer(i) {

    this.i = i;
    this.tutorial5 = this.modalCtrl.create(SurveymodalPage, { que_no: i });
    firebase.database().ref().child('usersurvery/' + this.userr_id).once('value', ((mydat) => {

      if (mydat.val() == null || mydat.val().survery == undefined) {

        this.tutorial5.present();
      }
    }))

    if (this.tutorial5 != undefined) {
      this.tutorial5.onDidDismiss((new_i, length) => {
        console.log(new_i, 'length ' + length);
        if (new_i < length) {
          this.answer(new_i);
        } else {
          //survery is complete
          firebase.database().ref().child('usersurvery/' + this.userr_id).update({
            survery: 1
          })
        }
      });
    }
  }


  answer2(i) {
    this.i = i;
    firebase.database().ref('surveyquestion').once('value', ((allquestions) => {
      if ((allquestions.val())) {
        console.log(allquestions.val())
        console.log(Object.keys(allquestions.val()).length);
        var length = Object.keys(allquestions.val()).length;
        // console.log( allquestions.val()[Object.keys(allquestions.val())[0]].question);
        if (i < length) {
          var x = allquestions.val()[Object.keys(allquestions.val())[i]].question;
          console.log(x.question)
          var y = allquestions.val()[Object.keys(allquestions.val())[i]].options;
          console.log(y)
          var options = []
          for (var j in y) {
            console.log(y[j]);
            options.push({ value: y[j], label: y[j], type: 'radio' });
          }
          console.log(options)

          let prompt = this.alertCtrl.create({
            // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
            title: 'ANSWER QUESTIONS,<span style="width:100%;floart:left;">GET MORE SWEEPS ENTRIES</span>',
            message: x.question,
            cssClass: 'answer01 sunny01 ggg sunny ',
            inputs: options,
            buttons: [

              {
                text: 'Submit',
                handler: data => {
                  console.log('Saved clicked');
                  console.log(x.question)
                  console.log(data);
                  this.answer2(this.i + 1)
                  firebase.database().ref().child('usersurvery/' + this.userr_id).push({
                    question: x.question,
                    answer: data
                  })
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

            ],


          });

          prompt.present();
        }

      }
    }))
  }

  answer3() {
    let prompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: 'ANSWER QUESTIONS,<span style="width:100%;floart:left;">GET MORE SWEEPS ENTRIES</span>',
      subTitle: "What is your shampoo of choice for your child?",
      message: "<div class='kuchbhi'><img src='assets/img/pick1.jpg'><img src='assets/img/pick2.jpg'><img src='assets/img/pick3.jpg'></div>",
      cssClass: 'answer01 sunny01 ggg sunny ',

      inputs: [
        {
          name: 'email',
          placeholder: 'Other'
        },
      ],
      buttons: [

        {
          text: 'Submit',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.email);

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

      ],


    });
    prompt.present();
  }



  // used to filter the list
  setFilteredItems() {
    console.log(this.searchdata);
    var keyword = this.searchdata.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    console.log(keyword);
    console.log(keyword.length);

    if (keyword.length == 0) {
      console.log('plz write something');
      this.errorValue = '2';
      console.log(this.errorValue);
    } else {
      this.searchArray = this.filterItems(keyword);
      console.log('Filtering');
      this.errorValue = '0';
      console.log(this.errorValue);
    }
  }



  filterItems(searchTerm) {
    console.log('searchTerm.... ' + searchTerm);
    console.log(this.newss);
    if (this.newss != undefined) {
      return this.newss.filter((item) => {
        if (item.newsfeed != null) {
          return item.newsfeed.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }

      });
    }

  }
  // end filter

  searchbar() {
    firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
      .equalTo('tutorial4').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {
          this.buttonClicked = !this.buttonClicked;
        } else {
         this.tutorial4pageModal();
         this.search();
          
        }
      }
      ))
  }


  presentProfileModal() {
    let profileModal = this.modalCtrl.create(SearchPage);
    profileModal.present();
  }

  
  
  firstTutorial() {
    //alert('here')
    let newprofileModal = this.modalCtrl.create(Tutorial0Page);
    this.newprompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: '<span>Welcome to</span> <img src="assets/img/momma.png" align="center" class="momma1">',
      message: "Chat with other moms near you!",
      cssClass: 'sunny01 ggg sunny location1 nearyou',
    });

    newprofileModal.onDidDismiss((data)=>{
       this.newprompt.dismiss();
       this.getlocation();
    })
   
    firebase.database().ref().child('liked_status/' + this.userr_id).orderByChild('tutorial')
      .equalTo('tutorial0').once('value', ((likepopup) => {
        console.log(' Liked status ', likepopup.val());
        if (likepopup.val() != null) {
           this.getlocation();
        } else {
         // alert('present');
              newprofileModal.present();
              this.newprompt.present();
              firebase.database().ref().child('liked_status/' + this.userr_id).push({
                tutorial: 'tutorial0'
              })
            
        }
      }
      ))
  }



}

