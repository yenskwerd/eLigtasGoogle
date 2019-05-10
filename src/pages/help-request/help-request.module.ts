import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpRequestPage } from './help-request';

@NgModule({
  declarations: [
    HelpRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpRequestPage),
  ],
})
export class HelpRequestPageModule {}
