import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
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

  option: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http   : Http, public loading:LoadingController, public loginService: LoginServiceProvider) {
    this.event = navParams.data.event;
    this.injured = navParams.data.persons_injured;
    this.trapped = navParams.data.persons_trapped;
    this.other = navParams.data.other_info;
    this.special = navParams.data.special_needs;
    this.request_status_id=navParams.data.request_status_id;
    this.request_id=navParams.data.request_id;
    this.option = navParams.data.option;
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
      request_id: this.request_id,
      option: this.option
    }
    let loader = this.loading.create({
    });
  
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

    this.navCtrl.setRoot('RespMapPage');
    //  location.reload();
        });

    /********** LOG **********/
        
    // let data2 = {
    //   user_id: this.loginService.logged_in_user_id,
    //   action: "Respond",
    //   action_datetime: new Date(),
    //   request_id: this.request_id
    // }
    
    // this.http.post('http://usc-dcis.com/eligtas.app/log.php', data2, options)
    
    // .map(res=> res.json())
    // .subscribe((data2: any) =>
    // {
    //    console.log(data2);
    // },
    // (error : any) =>
    // {
    //   console.log(error);
    // });

    
    let data2 = {
      user_id: this.loginService.logged_in_user_id,
      action: "Respond",
      action_datetime: new Date(),
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

    /********** END OF LOG **********/
  }

  pushBackToMap(){
 
    this.navCtrl.setRoot('RespMapPage');
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
        console.dir(data);
        this.items = data;
        // this.getResult(data);
     },
     (error : any) =>
     {
        console.dir(error);
     });   
  }

}
