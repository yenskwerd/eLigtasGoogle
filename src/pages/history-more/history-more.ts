import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HistoryMorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history-more',
  templateUrl: 'history-more.html',
})
export class HistoryMorePage {
  item: any = this.navParams.data.item;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.data.item)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryMorePage');
  }

}
