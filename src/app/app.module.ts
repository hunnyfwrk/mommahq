import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpModule, Headers, RequestOptions } from '@angular/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import {GoogleMaps,GoogleMap,GoogleMapsEvent,LatLng,CameraPosition,MarkerOptions,Marker,Geocoder} from '@ionic-native/google-maps';
import { TabsPage } from '../pages/tabs/tabs';
import { Intro } from '../pages/intro/intro';
import { StartPage } from '../pages/start/start';
import { SignupPage } from "../pages/signup/signup";
import { LoginPage } from '../pages/login/login';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed';
import { SetPage } from '../pages/set/set';
import { SavediscussionPage } from '../pages/savediscussion/savediscussion';
import { CommentPage } from '../pages/comment/comment';
import { ProfilePage } from '../pages/profile/profile';
import { InvitePage } from '../pages/invite/invite';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { SearchPage } from '../pages/search/search';
import { ContactusPage } from '../pages/contactus/contactus';
import {EditprofilePage } from '../pages/editprofile/editprofile';
import { NewsfeedProvider } from '../providers/newsfeed/newsfeed';
import { KeysPipe } from './KeysPipe.pipe' 
import { OrderBy } from './orderby.pipe'
import { SocialSharing } from '@ionic-native/social-sharing';
import { Firebase } from '@ionic-native/firebase';
import { PolicyPage } from "../pages/policy/policy"; 
import { RulesPage } from "../pages/rules/rules";
import { Tutorial0Page } from "../pages/tutorial0/tutorial0";
import { TutorialPage } from "../pages/tutorial/tutorial";
import { Tutorial2Page } from "../pages/tutorial2/tutorial2";
import { Tutorial3Page } from "../pages/tutorial3/tutorial3";
import { Tutorial4Page } from "../pages/tutorial4/tutorial4";
import { Tutorial5Page } from "../pages/tutorial5/tutorial5";
import { Tutorial6Page } from "../pages/tutorial6/tutorial6";
import { Tutorial7Page } from "../pages/tutorial7/tutorial7"; // ,
import { Tutorial8Page } from "../pages/tutorial8/tutorial8";
import { SurveymodalPage } from "../pages/surveymodal/surveymodal";
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Intro,
    StartPage,
    SignupPage,
    LoginPage,
    NewsfeedPage,
    SetPage,
    SavediscussionPage,
    CommentPage,
    ProfilePage,
    InvitePage,
    ContactPage,
    AboutPage,
    SearchPage,
    ContactusPage,
    EditprofilePage,
    KeysPipe,
    OrderBy,
    PolicyPage,
    RulesPage,
    TutorialPage,
    Tutorial2Page,
    Tutorial3Page,
    Tutorial4Page,
    Tutorial5Page,
    Tutorial6Page,
    Tutorial7Page,
    SurveymodalPage,
    Tutorial8Page,
    Tutorial0Page
],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
     MomentModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    Intro,
    StartPage,
    SignupPage,
    LoginPage,
    NewsfeedPage,
    SetPage,
    SavediscussionPage,
    CommentPage,
    ProfilePage,
    InvitePage,
    ContactPage,
    AboutPage,
    SearchPage,
    ContactusPage,
    EditprofilePage,
    PolicyPage,
    RulesPage,
    TutorialPage,
    Tutorial2Page,
    Tutorial3Page,
    Tutorial4Page,
    Tutorial5Page,
     Tutorial6Page,
    Tutorial7Page,
     Tutorial8Page,
    SurveymodalPage,
    Tutorial0Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    Geolocation,
    Diagnostic,
    HttpModule,
    GoogleMaps,
    Geocoder,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NewsfeedProvider,
    Camera,
    Firebase,
    SocialSharing,
    GooglePlus
  ]
})
export class AppModule { }
