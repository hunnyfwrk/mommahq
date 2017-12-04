import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { TabsPage } from '../pages/tabs/tabs';
import { Intro} from '../pages/intro/intro';
import { StartPage} from '../pages/start/start';
import { SignupPage} from '../pages/signup/signup';
import { LoginPage} from '../pages/login/login';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = StartPage;

NewsfeedPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
