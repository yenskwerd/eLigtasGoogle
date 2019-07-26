import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController  } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

import 'rxjs/add/operator/map';
/**
 * Generated class for the PersonstatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personstatus',
  templateUrl: 'personstatus.html',
})
export class PersonstatusPage {

  private currentSafe = 0;
  private currentTransfer = 0;
  private currentDead = 0;
  private currentMissing = 0;
  constructor(public viewCtrl : ViewController, private http: Http, public loginService: LoginServiceProvider, public alertCtrl:AlertController, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonstatusPage');
  }

  incrementSafe () {
    this.currentSafe++;
  }
  
  decrementSafe () {
    this.currentSafe=(this.currentSafe==0)?0:this.currentSafe-1;
  }

  incrementTransfer () {
    this.currentTransfer++;
  }
  
  decrementTransfer () {
    this.currentTransfer=(this.currentTransfer==0)?0:this.currentTransfer-1;
  }

  incrementDead () {
    this.currentDead++;
  }
  
  decrementDead () {
    this.currentDead=(this.currentDead==0)?0:this.currentDead-1;
  }

  incrementMissing () {
    this.currentMissing++;
  }
  
  decrementMissing () {
    this.currentMissing=(this.currentMissing==0)?0:this.currentMissing-1;
  }

  SubmitDis(){
    let alert = this.alertCtrl.create({
      message: 'Diposition submitted.'
    });
    alert.present();
  }
}
