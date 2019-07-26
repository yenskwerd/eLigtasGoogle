import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventReportPage } from './event-report';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EventReportPage,
  ],
  imports: [
    IonicPageModule.forChild(EventReportPage),
    TranslateModule
  ],
})
export class EventReportPageModule {}
