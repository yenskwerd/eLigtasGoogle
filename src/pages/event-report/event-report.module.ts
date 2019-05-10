import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventReportPage } from './event-report';

@NgModule({
  declarations: [
    EventReportPage,
  ],
  imports: [
    IonicPageModule.forChild(EventReportPage),
  ],
})
export class EventReportPageModule {}
