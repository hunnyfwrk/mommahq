import { Component } from '@angular/core';
import { Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TabsPage } from '../pages/tabs/tabs';
import { Intro } from '../pages/intro/intro';
import { StartPage } from '../pages/start/start';
import { SetPage } from '../pages/set/set';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed';
import { SavediscussionPage } from '../pages/savediscussion/savediscussion';
import { CommentPage } from '../pages/comment/comment';
import { ProfilePage } from '../pages/profile/profile';
import { InvitePage } from '../pages/invite/invite';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { SearchPage } from '../pages/search/search';
import { ContactusPage } from '../pages/contactus/contactus';
import { Firebase } from '@ionic-native/firebase';
import { PolicyPage } from "../pages//policy/policy"; 
import { SurveymodalPage } from "../pages/surveymodal/surveymodal";


export class NotificationModel {
    public body: string;
    public title: string;
    public tap: boolean
}


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = StartPage;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null; user ;
  //NewsfeedPage:any = TabsPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private idle: Idle,
    private keepalive: Keepalive,
    public firebase1: Firebase,
    public alertCtrl : AlertController,
		public events : Events
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.firebase1.grantPermission();   // for push notifications

      if (platform.is('cordova')) {
				// Initialize push notification feature
				//alert("hiiii"+this.platform)
				if(platform.is('android')){
					//alert("android"+this.platform)
					this.initializeFireBaseAndroid()
				}else{
				//	alert("ios"+this.platform)
					this.initializeFireBaseIos();
				}
				//this.platform.is('android') ? this.initializeFireBaseAndroid() : this.initializeFireBaseIos();
			} else {
			//	alert(this.platform)
				console.log('Push notifications are not enabled since this is not a real device');
			}

      platform.pause.subscribe(() => {
        if (localStorage.getItem('userid') != null) {
          var userid = localStorage.getItem('userid');
          if (localStorage.getItem('timekey') != null) {
            var key = localStorage.getItem('timekey');
            var d = new Date()
            firebase.database().ref().child('users/' + userid + '/active/' + key).update({
              idletime: d.getTime(),
            })
          }

        }
      });


      platform.resume.subscribe(() => {
          this.firebase1.grantPermission();   // for push notifications
        if (localStorage.getItem('userid') != null) {
          var userid = localStorage.getItem('userid');
          var newPostKey = firebase.database().ref().child('users/' + userid + '/active/').push().key;
          localStorage.setItem('timekey', newPostKey);
          var d = new Date()
          var uservalues = {
            activetime: d.getTime(),
            idletime: 0,
          }
          var updates = {};
          updates['users/' + userid + '/active/' + newPostKey] = uservalues;
          firebase.database().ref().update(updates);

        }
      });
      this.rootPage = localStorage.getItem('userid') != null ? NewsfeedPage : StartPage;

      idle.setIdle(120);  // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      idle.setTimeout(5); // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      idle.onIdleEnd.subscribe(() => {
        this.idleState = 'No longer idle.'

        //alert(this.idleState)
      });
      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
      });
      idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
        console.log(this.idleState)
      }
      );


      this.reset();

    });
  }

private initializeFireBaseAndroid(): Promise<any> {
		return this.firebase1.getToken()
			.catch(error => console.error('Error getting token', error))
			.then(token => {

				console.log(`The token is ${token}`);

				Promise.all([
					this.firebase1.subscribe('firebase-app'), 	// Subscribe to the entire app
					this.firebase1.subscribe('android'),			// Subscribe to android users topic
					this.firebase1.subscribe('userid-1') 		// Subscribe using the user id (hardcoded in this example)
				]).then((result) => {
					if (result[0]) console.log(`Subscribed to FirebaseDemo`);
					if (result[1]) console.log(`Subscribed to Android`);
					if (result[2]) console.log(`Subscribed as User`);

					this.subscribeToPushNotificationEvents();
				});
			});
	}

	private initializeFireBaseIos(): Promise<any> {
		return this.firebase1.grantPermission()
			.catch(error => console.error('Error getting permission', error))
			.then(() => {
				this.firebase1.getToken()
					.catch(error => console.error('Error getting token', error))
					.then(token => {

						console.log(`The token is ${token}`);

						Promise.all([
							this.firebase1.subscribe('firebase-app'),
							this.firebase1.subscribe('ios'),
							this.firebase1.subscribe('userid-2')
						]).then((result) => {

							if (result[0]) console.log(`Subscribed to FirebaseDemo`);
							if (result[1]) console.log(`Subscribed to iOS`);
							if (result[2]) console.log(`Subscribed as User`);

							this.subscribeToPushNotificationEvents();
						});
					});
			})

	}

	private saveToken(token: any): Promise<any> {
		// Send the token to the server
		console.log('Sending token to the server...');
		return Promise.resolve(true);
	}

	private subscribeToPushNotificationEvents(): void {
		this.firebase1.onTokenRefresh().subscribe(
			token => {
				console.log(`The new token is ${token}`);
				this.saveToken(token);
			},
			error => {
				console.error('Error refreshing token', error);
			});

		// Handle incoming notifications
		this.firebase1.onNotificationOpen().subscribe(
			(notification: NotificationModel) => {
				//alert('alert - > ' + JSON.stringify(notification))

				if (notification.tap) {
					let notificationAlert = this.alertCtrl.create({
						title: '<center>' + notification.title + '</center>',
						message: notification.body,
						buttons: [{
							text: 'Okay',
							role: 'cancel'
						}, 
						// {
						// 	text: 'View',
						// 	handler: () => {
								
						// 	}
						// }
						]
					});
					if (localStorage.getItem('userid') != null || localStorage.getItem('userid') != undefined) {
						if (notification.body == 'New survey!') {
							this.events.publish('newpush', 'yes');
						} else {
							notificationAlert.present();
						}
					} else {
						localStorage.setItem('newpush', 'yes');
						//	alert(localStorage.getItem('newpush'));
					}
			
				} else {
					let notificationAlert = this.alertCtrl.create({
						title: '<center>' + notification.title + '</center>',
						message: notification.body,
						buttons: [{
							text: 'Okay',
							role: 'cancel'
						},
						//  {
						// 	text: 'View',
						// 	handler: () => {
								
						// 	}
						// }
						]
					});
					// notificationAlert.present();
					if (localStorage.getItem('userid') != null || localStorage.getItem('userid') != undefined) {
						if (notification.body == 'New survey!') {
							this.events.publish('newpush', 'yes');
						} else {
							notificationAlert.present();
							//localStorage.setItem('newpush','yes');
						}
					} else {
						localStorage.setItem('newpush', 'yes');
						//alert(localStorage.getItem('newpush'));
					}
				}
			},
			error => {
				console.error('Error getting the notification', error);
			});
	}

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

}
