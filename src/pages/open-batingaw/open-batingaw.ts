import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OpenBatingawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open-batingaw',
  templateUrl: 'open-batingaw.html',
})
export class OpenBatingawPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenBatingawPage');

    this.openApplication();

    this.navCtrl.pop();
  }

  openApplication(){
    window['plugins'].launcher.launch({
      packageName: 'com.batingaw.tudlo'
  }, 
  function(){ }, 
  function(){ 
      cordova.plugins['market'].open('com.batingaw.tudlo')
  }
  );
  }

}
