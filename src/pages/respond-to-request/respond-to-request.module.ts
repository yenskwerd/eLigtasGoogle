import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RespondToRequestPage } from './respond-to-request';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RespondToRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(RespondToRequestPage),
    TranslateModule
  ],
})
export class RespondToRequestPageModule {}
