import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RespMapPage } from './resp-map';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RespMapPage,
  ],
  imports: [
    IonicPageModule.forChild(RespMapPage),
    TranslateModule
  ],
})
export class RespMapPageModule {}
