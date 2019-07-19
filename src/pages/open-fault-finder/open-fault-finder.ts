import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OpenFaultFinderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open-fault-finder',
  templateUrl: 'open-fault-finder.html',
})
export class OpenFaultFinderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenFaultFinderPage');
    this.openApplication();
    this.navCtrl.pop();
  }

  openApplication(){
    window['plugins'].launcher.launch({
      packageName: 'com.phivolcs.faultfinder_0'
  }, 
  function(){ }, 
  function(){ 
      cordova.plugins['market'].open('com.phivolcs.faultfinder_0')
  }
  );
  }

}
