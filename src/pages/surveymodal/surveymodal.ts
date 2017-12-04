import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, ViewController } from 'ionic-angular';

import { NewsfeedProvider } from '../../providers/newsfeed/newsfeed';
/**
 * Generated class for the SurveymodalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-surveymodal',
  templateUrl: 'surveymodal.html',
})
export class SurveymodalPage {
  i; userr_id; questions:any; alloptions:any; length; currentdate;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public newsfeedProvider : NewsfeedProvider,
    public alertCtrl : AlertController,
    public events : Events
  ) {
    // alert('xcfbbsdffdfgfg')
    this.userr_id = localStorage.getItem('userid');
    var i = this.navParams.get('que_no');
    this.answer(i);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveymodalPage');
  }
  close2(){
     this.viewCtrl.dismiss();
     // survey was cancelled
      firebase.database().ref().child('usersurvery/' + this.userr_id).update({
            survery: 1
          })
  }

  close(answer, question){
    
    if (answer == undefined){
       alert('Please select an option');
    } else {


      var ValidAnswer = answer.replace(/\s/g, '');
      console.log(question);
      if (ValidAnswer.length == 0) {
        alert('Please type an answer');
      } else {
        firebase.database().ref().child('usersurvery/' + this.userr_id).push({
          question: question,
          answer: answer
        }).then((res)=>{
          firebase.database().ref().child('sweeptakes/' + this.userr_id + '/' + this.currentdate + '/post').transaction((values) => {
                  var newValue = (values || 0) + 1;
                  return newValue;
          })
        })
        this.viewCtrl.dismiss(this.i + 1, this.length);
      }
    }

  }

  answer(i) {
    this.i = i;
    console.log(this.i)
        firebase.database().ref('surveyquestion').once('value', ((allquestions) => {
          if ((allquestions.val())) {
            var length = Object.keys(allquestions.val()).length;
            this.length = length
            if (i < length) {
              var x = allquestions.val()[Object.keys(allquestions.val())[i]].question;

              var y = allquestions.val()[Object.keys(allquestions.val())[i]].options;

              this.questions = x;
              console.log(this.questions)
              let opt = [];
              if (x.mcq == 1) {
                for (var j in y) {
                  console.log(y[j]);
                  opt.push(y[j])
                }
                this.alloptions = opt;
                console.log(this.alloptions)
              } else if (x.mcq == 2) {
                for (var j in y) {
                  console.log(y[j]);
                  y[j] = this.newsfeedProvider.imgPath + y[j]
                  opt.push(y[j])
                }
                this.alloptions = opt;
                console.log(this.alloptions)
              } else {
                console.log('No options. Open ended question')
              }
            
            }
          }
        }))
  }

}
