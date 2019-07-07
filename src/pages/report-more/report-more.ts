import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReportMorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-more',
  templateUrl: 'report-more.html',
})
export class ReportMorePage {
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.data.data;
    console.log(this.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportMorePage');
  }

}
