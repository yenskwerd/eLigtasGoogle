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

  private incrementSafe () {
    this.currentSafe++;
  }
  
  private decrementSafe () {
    this.currentSafe--;
  }

  private incrementTransfer () {
    this.currentTransfer++;
  }
  
  private decrementTransfer () {
    this.currentTransfer--;
  }

  private incrementDead () {
    this.currentDead++;
  }
  
  private decrementDead () {
    this.currentDead--;
  }

  private incrementMissing () {
    this.currentMissing++;
  }
  
  private decrementMissing () {
    this.currentMissing--;
  }
}
