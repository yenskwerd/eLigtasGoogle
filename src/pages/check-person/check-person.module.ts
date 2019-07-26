import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckPersonPage } from './check-person';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CheckPersonPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckPersonPage),
    TranslateModule
  ],
})
export class CheckPersonPageModule {}
