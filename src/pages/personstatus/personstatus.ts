import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { TranslateService } from '@ngx-translate/core';
import { CallForBackupPage } from '../call-for-backup/call-for-backup';

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

  currentSafe = 0;
  currentTransfer = 0;
  currentDead = 0;
  currentMissing = 0;

  myDate = new Date();
  m = this.myDate.getMonth() + 1;
  y = this.myDate.getFullYear();
  da = this.myDate.getDate();
  h=this.myDate.getHours();
  mi=this.myDate.getMinutes();
  s=this.myDate.getSeconds();
  datetoday = this.y+"-"+this.m+"-"+this.da+" "+this.h+":"+this.mi+":"+this.s;

  request_id: any;

  constructor(public http2 : Http,
    private http: Http, 
    public loginService: LoginServiceProvider, 
    public alertCtrl:AlertController, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
      
      this.request_id=navParams.data.request_id;

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
    var headers = new Headers();
    
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

     
    /******** UPDATE REQUEST STATUS ID **********/
    let data2 = {
      request_id: this.request_id,
      request_status_id: 2
    }

    this.http2.post('http://usc-dcis.com/eligtas.app/update-request.php', data2, options)
    .map(res=> res.json())
    .subscribe((data2: any) =>
    {
      console.log(data2);
      // If the request was successful notify the user
      //  console.log(data2);
      //  let alert = this.alertCtrl.create({
      //   message: "You have started navigating(???)",
      //   buttons: ['OK']
      //   });
      //   alert.present();
    },
    (error : any) =>
    {
      console.log(error);
      let alert2 = this.alertCtrl.create({
        title:"FAILED",
        subTitle: "Request not updated. huhu!",
        buttons: ['OK']
        });

      alert2.present();
    });
    
    /********** LOG **********/
    let data3 = {
      user_id: this.loginService.logged_in_user_id,
      action: "Rescued",
      action_datetime: this.datetoday,
      request_id: this.request_id
    }
    
    this.http2.post('http://usc-dcis.com/eligtas.app/log.php', data3, options)
    
    .map(res=> res.json())
    .subscribe((data3: any) =>
    {
      console.log(data3);
    },
    (error : any) =>
    {
      console.log(error);
    });
    /********** END OF LOG **********/

    
    let data4 = {
      user_id: this.loginService.logged_in_user_id,
      stat_id: 0
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-statdispo.php', data4, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
       // If the request was successful notify the user
      //  console.log(data2);
      //  let alert = this.alertCtrl.create({
      //   message: "You have started navigating(???)",
      //   buttons: ['OK']
      //   });
      //   alert.present();
    },
    (error : any) =>
    {
      console.log(error);
      let alert2 = this.alertCtrl.create({
        title:"FAILED",
        subTitle: "Something went wrong!",
        buttons: ['OK']
        });

      alert2.present();
    });





    
    let alert = this.alertCtrl.create({
      message: 'Diposition submitted.',
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push('RespMapPage');
    this.loginService.resp_stat_id=4;
  }
}
