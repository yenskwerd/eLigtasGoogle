import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserMapPage } from './user-map';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserMapPage,
  ],
  imports: [
    IonicPageModule.forChild(UserMapPage),
    TranslateModule
  ],
})
export class UserMapPageModule {}
