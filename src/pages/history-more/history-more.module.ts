import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryMorePage } from './history-more';

@NgModule({
  declarations: [
    HistoryMorePage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryMorePage),
  ],
})
export class HistoryMorePageModule {}
