import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Events } from 'ionic-angular';

/**
 * Generated class for the LanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loginService: LoginServiceProvider, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  change(l: string){
    this.loginService.language = l;
    this.events.publish('user:login');
    this.navCtrl.pop();
  }

}
