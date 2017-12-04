import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';

import { LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

/*
  Generated class for the NewsfeedProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class NewsfeedProvider {
  public imgPath = 'http://netin.crystalbiltech.com/mommahq/src/image_uploads/';
  public latitude; longitude;
    dPipe = new DatePipe('en-US');
  constructor(
    public geolocation: Geolocation, public loadingCtrl : LoadingController, public diagnostic: Diagnostic
  ) {
    console.log('Hello NewsfeedProvider Provider');

  }
  currentdate(){
      var today:any =  this.dPipe.transform(new Date(), 'yyyy-MM-dd');
      return today;
    }
  getdistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  getcurrentlatlong(options) {

   
      // let options:GeolocationOptions = {
      //    maximumAge: 0, timeout: 5000, enableHighAccuracy: false
      // };
    // this.diagnostic.isNetworkLocationAvailable().then(() => {


      return {
        loc: this.geolocation.getCurrentPosition(options).then((resp) => {

          this.latitude = resp.coords.latitude;
          this.longitude = resp.coords.longitude;
          var position = new Array();
          position['lat'] = this.latitude;
          position['lon'] = this.longitude;
          return position;

        }).catch((error) => {
          console.log('Error getting location', error);
          // this.diagnostic.switchToLocationSettings();

        }),
      }
    // }).catch(()=>{
    //   this.diagnostic.switchToLocationSettings();
    // })
  }

  getAge(birth) {
    var ageMS = Date.parse(Date()) - Date.parse(birth);
    var age = new Date();
    age.setTime(ageMS);
    var ageYear = age.getFullYear() - 1970;
    var ageMonth = age.getMonth();
    var ageDay = age.getDate();
    return parseFloat(ageYear + "." + ageMonth)

    // ageMonth = age.getMonth(); // Accurate calculation of the month part of the age
    // ageDay = age.getDate();    // Approximate calculation of the day part of the age
  }

  getMonths(d2) {
    var months;
    var split = d2.split('-');
    var month = split[1] - 1;
    var formatted = new Date(split[0], month, split[2]);
    var d1 = new Date();

    months = (formatted.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += formatted.getMonth();
    

      return formatted.getMonth() - d1.getMonth()
       + (12 * (formatted.getFullYear() - d1.getFullYear()));


   // return months <= 0 ? 0 : months;
  }
  get_days(req_date){
    return moment(req_date).diff(moment(this.dPipe.transform(new Date(), 'yyyy-MM-dd')), 'days')
  }
}
