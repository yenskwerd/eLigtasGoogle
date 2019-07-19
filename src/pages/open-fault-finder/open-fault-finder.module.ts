import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpenFaultFinderPage } from './open-fault-finder';

@NgModule({
  declarations: [
    OpenFaultFinderPage,
  ],
  imports: [
    IonicPageModule.forChild(OpenFaultFinderPage),
  ],
})
export class OpenFaultFinderPageModule {}
