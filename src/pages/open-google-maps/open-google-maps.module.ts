import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpenGoogleMapsPage } from './open-google-maps';

@NgModule({
  declarations: [
    OpenGoogleMapsPage,
  ],
  imports: [
    IonicPageModule.forChild(OpenGoogleMapsPage),
  ],
})
export class OpenGoogleMapsPageModule {}
