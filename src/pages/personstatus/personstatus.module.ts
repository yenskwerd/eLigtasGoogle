import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonstatusPage } from './personstatus';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PersonstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonstatusPage),
    TranslateModule
  ],
})
export class PersonstatusPageModule {}
