import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonstatusPage } from './personstatus';

@NgModule({
  declarations: [
    PersonstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonstatusPage),
  ],
})
export class PersonstatusPageModule {}
