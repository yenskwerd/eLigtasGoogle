import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChangeNamePage } from '../change-name/change-name';
import { ChangePasswordPage } from '../change-password/change-password';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  change(language: string){
    if(language == "name"){
      this.navCtrl.push(ChangeNamePage);
    }else{
      this.navCtrl.push(ChangePasswordPage);
    }
  }

}
