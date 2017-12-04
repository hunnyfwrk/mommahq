import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SetPage } from '../set/set';
import { AlertController,ActionSheetController,LoadingController } from 'ionic-angular';
//import { SavediscussionPage } from "../savediscussion/savediscussion";
import { NewsfeedProvider } from '../../providers/newsfeed/newsfeed';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { RulesPage } from "../rules/rules"; 
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpModule, Http, Headers, RequestOptions } from '@angular/http';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker,
  Geocoder
} from '@ionic-native/google-maps';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, Events, ModalController } from 'ionic-angular';
import { EditprofilePage } from '../editprofile/editprofile';
declare var google;
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public rootPage: any; public homebasetext; homeaddress;
  public fireAuth: any; currentaddress: any;
  public userProfile: any;
  public firstname: any; lastname;
  public latitude; longitude; user_id; dd; mm; yyyy; currentmonth; totalsweeps = 0; thismonthsweeps = 0;
  public child; childrens; childdata: any = [];
  //public google;
  @ViewChild('map') mapElement;
  map: any;picture;base64Image;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private googleMaps: GoogleMaps,
    public geolocation: Geolocation,
    private toastCtrl: ToastController,
    private diagnostic: Diagnostic,
    public newsfeedProvider : NewsfeedProvider,
    public geocoder: Geocoder,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public http : Http,
    public loadingCtrl : LoadingController,
    public events : Events
  ) {
    // alert('jj')
    this.picture = localStorage.getItem('userpic');
    var name = localStorage.getItem('username');
    this.events.subscribe('username', () => {
        name = localStorage.getItem("username");
        var sub = name.split(' ');
        this.firstname = sub[0];
        this.lastname = sub[1].substring(0, 1);
    })
    console.log(name);
    // var startMatch = new RegExp(this.username, "i");
    var sub = name.split(' ');
    console.log(sub[1]);
    this.firstname = sub[0];
    this.lastname = sub[1].substring(0, 1);
    this.user_id = localStorage.getItem('userid');
    this.viewuser();
    this.usersweeptakes();
    var today = new Date();
    this.dd = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    this.yyyy = today.getFullYear();
  }
  /*
  * Map starts here
  */

  // Load map only after view is initialized
  ngAfterViewInit() {
    console.log('hitted')
    this.loadMap1();
  }

  editprofile() {
    this.navCtrl.push(EditprofilePage);
  }
  showtoast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
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
              quality: 10,
              sourceType: 1,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation : true
            }

            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              // this.picture;
              this.base64Image = imageData;
              this.changeprofilepic();
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
              quality: 10,
              sourceType: 0,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation : true
            }

            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              // this.picture
              this.base64Image = imageData;
              this.changeprofilepic();
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

  changeprofilepic() {

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    var postdata = {
      image: this.base64Image
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    loading.present().then(() => {
      this.http.post('http://netin.crystalbiltech.com/mommahq/src/js/controllers/image_upload.php', postdata, options)
        .map(resp => resp.json())
        .subscribe(dataa => {
          
          // alert(JSON.stringify(dataa));
          if (dataa.status == 1) {
            loading.dismiss();
            firebase.database().ref().child("users/" + this.user_id).update({
              image: this.newsfeedProvider.imgPath+dataa.name
            }).then((res) => {
              this.showtoast('Profile picture updated successfully');
              this.picture = this.newsfeedProvider.imgPath+dataa.name;
              //alert(this.picture)
              localStorage.setItem('userpic', this.picture);
              this.events.publish('userpic','updated')
            })
          } else {
             loading.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Error in uploading the image',
              duration: 3000,
              cssClass: 'toastCss',
              position: 'bottom',
            });
            toast.present();
          }
        })
    })


    //
    
  }


  //*****************View User Profile from firebase database*****************//   

  usersweeptakes() {
    firebase.database().ref().child('sweeptakes/' + this.user_id).once('value', ((valuess) => {
      console.log(valuess.val())
      var sweeptakes = valuess.val()
      if (sweeptakes) {
        for (var sweeptake in sweeptakes) {
          console.log(sweeptake);
          console.log(sweeptakes[sweeptake])
          var dateval = sweeptake.split('-');
          for (var totalsweep in sweeptakes[sweeptake]) {
            this.totalsweeps = this.totalsweeps + sweeptakes[sweeptake][totalsweep]
          }

          if (dateval[1] == this.mm && dateval[2] == this.yyyy) {
            switch (dateval[1]) {
              case '1':
                this.currentmonth = "January";
                break;
              case '2':
                this.currentmonth = "February";
                break;
              case '3':
                this.currentmonth = "March";
                break;
              case '4':
                this.currentmonth = "April";
                break;
              case '5':
                this.currentmonth = "May";
                break;
              case '6':
                this.currentmonth = "June";
                break;
              case '7':
                this.currentmonth = "July";
                break;
              case '8':
                this.currentmonth = "August";
                break;
              case '9':
                this.currentmonth = "September";
                break;
              case '10':
                this.currentmonth = "October";
                break;
              case '11':
                this.currentmonth = "November";
                break;
              case '12':
                this.currentmonth = "December";
                break;
            }
            console.log(this.currentmonth)
            for (var monthlysweep in sweeptakes[sweeptake]) {
              this.thismonthsweeps = this.thismonthsweeps + sweeptakes[sweeptake][monthlysweep]
              //this.thismonthsweeps = 1000;
            }
          }

        }

      } else {
        console.log(this.mm)
        var month = JSON.stringify(this.mm);
        switch (month) {
          case '1':
            this.currentmonth = "January";
            break;
          case '2':
            this.currentmonth = "February";
            break;
          case '3':
            this.currentmonth = "March";
            break;
          case '4':
            this.currentmonth = "April";
            break;
          case '5':
            this.currentmonth = "May";
            break;
          case '6':
            this.currentmonth = "June";
            break;
          case '7':
            this.currentmonth = "July";
            break;
          case '8':
            this.currentmonth = "August";
            break;
          case '9':
            this.currentmonth = "September";
            break;
          case '10':
            this.currentmonth = "October";
            break;
          case '11':
            this.currentmonth = "November";
            break;
          case '12':
            this.currentmonth = "December";
            break;
        }
  
      }
    })
    )
  }
  viewuser() {
    var userid = localStorage.getItem('userid');
    console.log(userid);
    firebase.database().ref().child('users/' + userid).on('value', ((datachild) => {
      this.userProfile = datachild.val();
      console.log(this.userProfile)
    }))


    var userid = localStorage.getItem('userid');
    console.log(userid);

    firebase.database().ref().child('Children/' + userid).on('value', ((datachild) => {
      this.childdata = []
      if (datachild.val()) {
        this.child = datachild.val();
        console.log(this.child);
        for (var i in this.child.child) {
          console.log('mydata')
          console.log(i);
          this.childdata.push(this.child.child[i]);
          console.log(this.childdata);
        }
      }


    }))
  }
  //*****************  End View User Profile from firebase database  *****************//   

  set() {
    this.navCtrl.push(SetPage);
  }

  logout() {
    var aa = this;
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
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

  heart() {
    let alert = this.alertCtrl.create({
      cssClass: 'sunny01 ggg',
      title: '<img src="../assets/img/heart1.png" align="left" class="setting-img">Save Discussions<a><img src="../assets/img/close-btn.png" class="close_position"></a>',
      message: 'Click the heart to save discussion and access them anytime without having to scroll through the newsfeed',
      subTitle: '',
    });
    alert.present();
  }
  //*********************************  Load map code using Location *********************************** *//


  loadMap1() {
    var aa = this;
    /// if (data.zipcode != '') {
    var user = firebase.auth().currentUser;
    var useridd = localStorage.getItem('userid');
    firebase.database().ref().child('/users/' + useridd + '/homeaddress').once('value', (res) => {
      console.log(res.val());

      if (res.val()) {
          this.homebasetext = 'Change'
        // aa.geocoder.geocode({ 'address': res.val().zipcode }).then((result) => {

          // if (Object.keys(result).length > 0) {

            aa.latitude = res.val().latitude;
            aa.longitude = res.val().longitude;
            console.log(aa.latitude, aa.longitude)
            // var address = result[0].extra.lines[0];
            var position = [];

            firebase.database().ref().child('users/')
              .once('value', ((allusers) => {
                var users = allusers.val();

                for (var i in users) {
                 // console.log(i);  
                  if (i == useridd){ //so that user can see only his location
                    if (users[i].homeaddress != undefined) {
                      console.log(users[i].homeaddress);
                      var distance = aa.newsfeedProvider.getdistance(aa.latitude, aa.longitude, users[i].homeaddress.latitude, users[i].homeaddress.longitude, "K");
                      var range = (distance).toFixed(2);
                         console.log(range)
                    //  if (parseFloat(range) < 50.00) {
                     
                        position.push(users[i].homeaddress);
                    //  }
                    }
                  }
                }
                console.log(position)
              })
              );

            let latLng = new google.maps.LatLng(aa.latitude, aa.longitude);
            var bounds = new google.maps.LatLngBounds();
            let mapOptions = {
              center: latLng,
              zoom:7,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            // Loop through our array of markers & place each one on the map  
            let timeoutId = setTimeout(() => {
                console.log(useridd);
             for (var i = 0; i < position.length; i++) {
                  console.log(useridd);
            
                var allpositions = new google.maps.LatLng(position[i].latitude, position[i].longitude);
                // var marker = new google.maps.Marker({
                //   position: allpositions,
                //   map: this.map,
                // });
                bounds.extend(allpositions);
                this.map.fitBounds(bounds);
                if (this.map.getZoom() > 8) {
                  this.map.setZoom(15);
                }
             }
            }, 800);

          // }
        // })
      } else {

        this.homebasetext = 'Add'
        let toast = this.toastCtrl.create({
          message: 'Please add your zipcode to locate your home based moms',
          duration: 3000,
        })
        toast.present();
      }



    })



    ///
    // this.geolocation.getCurrentPosition().then((resp) => {


    // }).catch((error) => {
    //   console.log('Error getting location', error);
    //   // alert(error)
    //   let toast = aa.toastCtrl.create({
    //     message: 'Please turn on your location',
    //     duration: 3000,
    //     cssClass: 'toastCss',
    //     position: 'bottom',
    //   });
    //   toast.present();
    //   this.diagnostic.switchToLocationSettings();
    // });


  }


  addhomebase(msg) {
    console.log(msg);

    let prompt = this.alertCtrl.create({
      // <ion-icon ios="ios-close-circle" md="md-close-circle"></ion-icon>
      title: '<img src="assets/img/momma.png" align="left" class="momma1">',
      message: msg + ' zip code',
      cssClass: 'sunny01 ggg sunny location1',
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
            console.log('BUTTON CLICKED');
            var baseurl = 'https://maps.googleapis.com/maps/api/geocode/json?address='
            //  this.geocoder.geocode({ 'address': data.zipcode }).then((result) => {
            this.http.get(baseurl + data.zipcode)
              .map(res => res.json())
              .subscribe(result => {

                console.log(result.results[0])

                
                if (result.status == 'OK') {
                  this.homeaddress = {
                    latitude: result.results[0].geometry.location.lat,
                    longitude: result.results[0].geometry.location.lng,
                    address: result.results[0].formatted_address,
                    zip: data.zipcode,
                  }
         
                  var useridd = localStorage.getItem('userid');
                
                  firebase.database().ref().child('/users/' + useridd + '/homeaddress').update(
                    this.homeaddress).then(data => {
          
                      this.showtoast('Home base has been updated');
                      this.loadMap1();
                    }, (err) => {

                      this.showtoast(err);
                    }).catch(error => {

                      this.showtoast(error);
                    })
                } else {
                  this.showtoast('Could not find the location associated with the zipcode');
                }
                //  }, error=>{
                //    console.log(error)
                //  })
              }, err => {
                this.showtoast('Something went wrong');
              })
          }
        },{
          text: 'X',
          role: 'cancel',
          cssClass: 'close_position',
          handler: data => {
              console.log('nope')
          }
        },]
    })
    prompt.present();
  }


  //******************   Get Current Lat Long    *********************//


  // location() {
  //   //alert('location ok');
  //        var aa = this;
  //        this.geolocation.getCurrentPosition().then((resp) => {
  //        // resp.coords.latitude
  //        // resp.coords.longitude
  //        console.log(resp.coords.latitude);
  //        console.log(resp.coords.longitude);
  //        //  alert(resp.coords.latitude);
  //        //  alert(resp.coords.longitude);
  //        this.latitude = resp.coords.latitude;
  //        this.longitude = resp.coords.longitude;
  //       // alert(this.latitude+'/'+this.longitude);
  //        }).catch((error) => {
  //        console.log('Error getting location', error);
  //        // alert(error)
  //        let toast = aa.toastCtrl.create({
  //        message: 'Please on your location',
  //        duration: 3000,
  //        cssClass: 'toastCss',
  //        position: 'middle',
  //        });
  //        toast.present();
  //        this.diagnostic.switchToLocationSettings();
  //       });

  //     }



  //*************************** END Lat Long Code  ********************************//

 rules(){
   this.navCtrl.push(RulesPage);
 }
}
