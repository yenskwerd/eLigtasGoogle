import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpRequestPage } from './help-request';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HelpRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpRequestPage),
    TranslateModule
  ],
})
export class HelpRequestPageModule {}
