import { Component } from '@angular/core';
import { NavController ,AlertController, Events} from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { NewsfeedPage } from '../newsfeed/newsfeed';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NewsfeedPage;
  tab2Root = NewsfeedPage;
  tab3Root = NewsfeedPage;

  constructor(public alertCtrl:AlertController, public events : Events) {
          console.log('tabs page')
  }

  tabIndex(event) {
    var aa = this;
     console.log(event);
    var target = event.srcElement.parentNode.id || event.path[1].id;
    console.log(target)
    if (target == 'tab-t0-0') {
      aa.events.publish('page', 'newsfeed');     // event updates the list in the Fav page
    } else if (target == 'tab-t0-1') {
      aa.events.publish('page2', 'newsfeed');  // event updates the list in the Fav page
    } else if(target == 'tab-t0-2'){
       aa.events.publish('page3', 'newsfeed');
    }
}
  
}
