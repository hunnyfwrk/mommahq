import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveymodalPage } from './surveymodal';

@NgModule({
  declarations: [
    SurveymodalPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveymodalPage),
  ],
  exports: [
    SurveymodalPage
  ]
})
export class SurveymodalPageModule {}
