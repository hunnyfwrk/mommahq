import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import * as firebase from 'firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Http, Headers, RequestOptions } from '@angular/http';

import { TabsPage } from '../pages/tabs/tabs';
import { Intro } from '../pages/intro/intro';
import { StartPage } from '../pages/start/start';
import { SignupPage } from "../pages/signup/signup";
import { LoginPage } from '../pages/login/login';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Intro,
    StartPage,
    SignupPage,
    LoginPage,
    NewsfeedPage


  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    Intro,
    StartPage,
    SignupPage,
    LoginPage,
    NewsfeedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    Geolocation,
    Diagnostic,
    Http,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
