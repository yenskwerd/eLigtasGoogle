import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the RespondToRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-respond-to-request',
  templateUrl: 'respond-to-request.html',
})
export class RespondToRequestPage {
  items: any;
  request: any = [];
  event: any;
  injured: any;
  trapped: any;
  other: any;
  special: any;
  request_status_id;
  request_id;
  lat: any;
  long: any;
  eta:any;
  request_type: any;
  person: any;
  title: any;
  backup: any;
  reason: any;
  resources: any;

  option: any;
  z=0;
  myDate = new Date();
  m = this.myDate.getMonth() + 1;
  y = this.myDate.getFullYear();
  da = this.myDate.getDate();
  h=this.myDate.getHours();
  mi=this.myDate.getMinutes();
  s=this.myDate.getSeconds();
  datetoday = this.y+"-"+this.m+"-"+this.da+" "+this.h+":"+this.mi+":"+this.s;

  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public http   : Http, 
     public loading:LoadingController, 
     public loginService: LoginServiceProvider, 
     public alertCtrl: AlertController,
     public translate: TranslateService) {
       
    this.backup = navParams.data.backup;
    this.request_type = navParams.data.request_type_id;
    this.person = navParams.data.person_to_check;

    this.translate.get(navParams.data.event).subscribe(
      value => {
        // value is our translated string
        this.event = value;
    });
    this.injured = navParams.data.persons_injured;
    this.trapped = navParams.data.persons_trapped;
    this.other = navParams.data.other_info;
    this.special = navParams.data.special_needs;
    this.request_status_id=navParams.data.request_status_id;
    this.request_id=navParams.data.request_id;
    this.option = navParams.data.option;
    this.lat = navParams.data.request_lat;
    this.long = navParams.data.request_long;
    this.eta = navParams.data.ETA;
    
    if(this.request_type == 1){
      this.translate.get('Report').subscribe(
        value => {
          // value is our translated string
          this.title = value;
      });
    }else if(this.request_type == 2){
      this.translate.get('Help').subscribe(
        value => {
          // value is our translated string
          this.title = value;
      });
    }else{
      this.translate.get('Check').subscribe(
        value => {
          // value is our translated string
          this.title = value;
      });
    }
    if(this.backup == "YES"){
      this.backup = true;
      this.retrieveBackup();
    }
  }

  retrieveBackup(){
    var headers = new Headers();
        
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data1 = {
      request_id: this.request_id
    }

     this.http.post('http://usc-dcis.com/eligtas.app/retrieve-cfb-num.php',data1,options)
     .map(res=> res.json())
       .subscribe(
         res => {
          // this.callForBackUpMarker(res);
          this.reason = res.reason;
          this.resources = res.resources_needed;           
     }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RespondToRequestPage');
    this.load();
  }

  // ionViewDidLeave() {
  //   var headers = new Headers();
      
  //   headers.append("Accept", 'application/json');
  //   headers.append('Content-Type', 'application/x-www-form-urlencoded');
  //   headers.append('Access-Control-Allow-Origin' , '*');
  //   headers.append('Access-Control-Allow-Headers' , 'Content-Type');
  //   headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
  //   let options = new RequestOptions({ headers: headers });
  //   let data = {
  //     user_id: this.loginService.logged_in_user_id
  //   }
  //   console.log(data);

  //  this.http.post('http://usc-dcis.com/eligtas.app/retrieve-user-request.php',data,options)
  //  .map(res=> res.json())
  //    .subscribe(
  //      res => {
  //      console.log(res.request_id);
  //      this.loginService.logged_in_user_request_id = res.request_id;
  //  }); 

  //  console.log("Responded: " + this.loginService.logged_in_user_request_id);
  // }

  isReadonly() {return true;}
  
  pushRequestVisualizationPage(){
    this.navCtrl.setRoot('RespMapPage');
  }

  pushRespondNowPage(){
    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });
    let data = {
      user_id: this.loginService.logged_in_user_id,
      request_status_id: this.request_status_id,
      request_id: this.request_id
    }
    let loader = this.loading.create({
    });

    if(this.option == "CFB"){
      this.loginService.loginState = 4;
      //backup
      loader.present().then(() => {

        this.http.post('http://usc-dcis.com/eligtas.app/update-rescue1.php', data, options)
        .map(res => res.json())
        .subscribe(
          res => {
            
          });

        let data2 = {
          user_id: this.loginService.logged_in_user_id,
          action: "Backup",
          action_datetime: this.datetoday,
          request_id: this.request_id
        }
        
        this.http.post('http://usc-dcis.com/eligtas.app/log.php', data2, options)
        
        .map(res=> res.json())
        .subscribe((data2: any) =>
        {
           console.log(data2);
        },
        (error : any) =>
        {
          console.log(error);
        });
        this.navCtrl.setRoot('RespMapPage');
        loader.dismiss();
      });

      this.loginService.logged_in_user_request_id = this.request_id;
    }else{
      loader.present().then(() => {
        this.http.post('http://usc-dcis.com/eligtas.app/update-rescue.php',data,options)
        .map(res=> res.json())
          .subscribe(
            res => {
            loader.dismiss()
            console.log(res)
            });
            //gets user data
            let data2 = {
              user_id: this.loginService.logged_in_user_id
            }
            console.log(data);
            //update eta
            var headers = new Headers();
      
                headers.append("Accept", 'application/json');
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                headers.append('Access-Control-Allow-Origin' , '*');
                headers.append('Access-Control-Allow-Headers' , 'Content-Type');
                headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
                
                let options1 = new RequestOptions({ headers: headers });
                let data3 = {
                  request_id: this.request_id,
                  ETA: this.eta
                }
  
                this.http.post('http://usc-dcis.com/eligtas.app/update-request-ETA.php', data3, options1)
                .map(res=> res.json())
                .subscribe((data3: any) =>
                {
                  console.log(data3);
                  console.log(this.eta);
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
  
      this.navCtrl.setRoot('RespMapPage');
    // this.navCtrl.pop();
      //  location.reload();
          });

          let data2 = {
            user_id: this.loginService.logged_in_user_id,
            action: "Respond",
            action_datetime: this.datetoday,
            request_id: this.request_id
          }
          
          this.http.post('http://usc-dcis.com/eligtas.app/log.php', data2, options)
          
          .map(res=> res.json())
          .subscribe((data2: any) =>
          {
             console.log(data2);
          },
          (error : any) =>
          {
            console.log(error);
          });
      
    }
  }

  pushBackToMap(){
    // this.navCtrl.pop();
    // this.navCtrl.popToRoot();
    this.navCtrl.push('RespMapPage');
  }
 

  // getResult(data){
  //   // for (let i=0; i < data.length; i++) {
  //     this.request.push(
  //       { 
  //         event: data[0].event,
  //         injured: data[0].persons_injured,
  //         trapped: data[0].persons_trapped,
  //         other: data[0].other_info
  //       }
  //     );
  //   // }
  // }
  
  load() : void
  {
     this.http
     .get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
     .subscribe((data : any) =>
     {
        this.items = data;
        console.log("DARA: "+this.items)
        // this.getResult(data);
     },
     (error : any) =>
     {
        console.dir(error);
     });   
  }

}
