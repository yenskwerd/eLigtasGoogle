import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RescueInformationPage } from './rescue-information';

@NgModule({
  declarations: [
    RescueInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(RescueInformationPage),
  ],
})
export class RescueInformationPageModule {}
