import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckPersonPage } from './check-person';

@NgModule({
  declarations: [
    CheckPersonPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckPersonPage),
  ],
})
export class CheckPersonPageModule {}
