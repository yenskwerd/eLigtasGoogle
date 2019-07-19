import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OpenRedCrossPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open-red-cross',
  templateUrl: 'open-red-cross.html',
})
export class OpenRedCrossPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenRedCrossPage');
    this.openApplication();
    this.navCtrl.pop();
  }

  openApplication(){
    window['plugins'].launcher.launch({
      packageName: 'il.org.mda.philippine'
  }, 
  function(){ }, 
  function(){ 
      cordova.plugins['market'].open('il.org.mda.philippine')
  }
  );
  }

}
