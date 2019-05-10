import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {

  }

  openMap() {
    this.navCtrl.push("UserMapPage");
  }

  // ionViewWillEnter() {
  //   this.menuCtrl.swipeEnable(false);
  // }

  PushSignupPage(){
    this.navCtrl.push('SignupPage');
  }

  PushLoginPage(){
    this.navCtrl.push('LoginPage');
  }
}
