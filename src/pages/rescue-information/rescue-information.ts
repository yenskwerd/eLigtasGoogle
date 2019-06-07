import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RescueInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rescue-information',
  templateUrl: 'rescue-information.html',
})
export class RescueInformationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RescueInformationPage');
  }

  pushRescueInformationPage(){
    this.navCtrl.push('RescueInformationPage');
  }
}
