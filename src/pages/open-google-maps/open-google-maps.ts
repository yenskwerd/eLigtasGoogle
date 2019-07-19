import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OpenGoogleMapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open-google-maps',
  templateUrl: 'open-google-maps.html',
})
export class OpenGoogleMapsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenGoogleMapsPage');

    this.openApplication();

    this.navCtrl.pop();
  }

  openApplication(){
    window['plugins'].launcher.launch({
      packageName: 'com.google.android.apps.maps'
  }, 
  function(){ }, 
  function(){ 
      cordova.plugins['market'].open('com.google.android.apps.maps')
  }
  );
  }

}
