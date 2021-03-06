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
  count:any;

  constructor(public http2 : Http,
    private http: Http, 
    public loginService: LoginServiceProvider, 
    public alertCtrl:AlertController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public translate: TranslateService) {
      
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
      request_status_id: 3
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
        subTitle: "Please check your connection and try again!",
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
      let alert2 = this.alertCtrl.create({
        title:"FAILED 1",
        subTitle: "Something went wrong!",
        buttons: ['OK']
        });

      alert2.present();
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
        title:"FAILED 2",
        subTitle: "Please check your connection and try again!",
        buttons: ['OK']
        });

      alert2.present();
    });

    if(this.currentSafe!=0){
      let data5 = {
        request_id: this.request_id,
        current:this.currentSafe,
        dis_id:1,
      }
  
      this.http2.post('http://usc-dcis.com/eligtas.app/update-dispostatus.php', data5, options)
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
          title:"FAILED 3",
          subTitle: "Please check your connection and try again!",
          buttons: ['OK']
          });
  
        alert2.present();
      });
    }
    if(this.currentTransfer!=0){
      let data5 = {
        request_id: this.request_id,
        current:this.currentTransfer,
        dis_id:2,
      }
  
      this.http2.post('http://usc-dcis.com/eligtas.app/update-dispostatus.php', data5, options)
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
          title:"FAILED 4",
          subTitle: "Please check your connection and try again!",
          buttons: ['OK']
          });
  
        alert2.present();
      });
    }
    if(this.currentDead!=0){
      let data5 = {
        request_id: this.request_id,
        current:this.currentDead,
        dis_id:3,
      }
  
      this.http2.post('http://usc-dcis.com/eligtas.app/update-dispostatus.php', data5, options)
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
          title:"FAILED 5",
          subTitle: "Please check your connection and try again!",
          buttons: ['OK']
          });
  
        alert2.present();
      });
    }
    if(this.currentMissing!=0){
      let data5 = {
        request_id: this.request_id,
        current:this.currentMissing,
        dis_id:4,
      }
  
      this.http2.post('http://usc-dcis.com/eligtas.app/update-dispostatus.php', data5, options)
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
          title:"FAILED 6",
          subTitle: "Please check your connection and try again!",
          buttons: ['OK']
          });
  
        alert2.present();
      });
    }




    let message;
    this.translate.get('report').subscribe(
      value => {
        // value is our translated string
        message = value;
    });
    let alert = this.alertCtrl.create({
      message: message,
      buttons: ['Okay']
    });
    alert.present();
    this.navCtrl.push('RespMapPage');
    this.loginService.resp_stat_id=4;
  }
}
