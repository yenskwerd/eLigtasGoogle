import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LegendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-legend',
  templateUrl: 'legend.html',
})
export class LegendPage {

  icons: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icons = [
      { icon: "assets/imgs/user/hospital1.png", label: "Hospital 1"},
      { icon: "assets/imgs/user/hospital2.png", label: "Hospital 2"},
      { icon: "assets/imgs/user/hospital.png", label: "Hospital 3"},
      { icon: "assets/imgs/user/chu.png", label: "City Health Unit"},
      { icon: "assets/imgs/user/bhs.png", label: "Barangay Health Station"},
      { icon: "assets/imgs/user/health.png", label: "Rural Health Unit"},
      { icon: "assets/imgs/user/pav1.png", label: "Evacuation Center"},
      { icon: "assets/imgs/user/police.png", label: "Police Station"},
      { icon: "assets/imgs/user/fstn.png", label: "Fire Station"},
      { icon: "assets/imgs/user/gym.png", label: "Sports Center"},
      { icon: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png", label: "Current Location"},
      { icon: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png", label: "Unresponded Request"},
      { icon: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png", label: "Responded Request"},
      { icon: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png", label: "Requesting for Backup"},
      { icon: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png", label: "Rescued"},
      { icon: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png", label: "Unknown"}
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LegendPage');
  }

}
