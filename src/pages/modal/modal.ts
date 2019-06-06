import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController  } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

import 'rxjs/add/operator/map';
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  @ViewChild('victim_name') victim_name;
  @ViewChild('victim_desc') victim_desc;

  desc: any;
  triage: any;
  event: any;
  request_id: any;

  constructor(public viewCtrl : ViewController, private http: Http, public loginService: LoginServiceProvider, public alertCtrl:AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.event = navParams.data.event;
    this.request_id = navParams.data.request_id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  public closeModal(){
    let data = { 
      victim_name: this.victim_name.value,
      victim_desc: this.victim_desc.value,
      event: this.event,
      request_id: this.request_id,
      triage: this.triage
    }
    this.viewCtrl.dismiss(data);
    console.log(data);
  }


  triagefilter(){
    console.log(this.triage)
  }

  report(){
    if(this.victim_name.value==""){
        
          let alert = this.alertCtrl.create({
            message:"Victim name field is empty!",
            buttons: ['OK']
          
          });
          
          alert.present();
        
    } else if (this.victim_desc.value==""){
        
          let alert = this.alertCtrl.create({
            message:"Description field is empty!",
            buttons: ['OK']
  
          });
          
          alert.present();
         
    } else {
        var headers = new Headers();
      
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Headers' , 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        
        
        let options = new RequestOptions({ headers: headers });

        let data = {
          victim_name: this.victim_name.value,
          victim_desc: this.victim_desc.value,
          event: this.event,
          triage: this.triage,
          request_id: this.request_id,

          /********** LOG **********/
          user_id: this.loginService.logged_in_user_id,
          action: "Victim Report",
          action_done: this.triage,
          action_datetime: new Date()
        }
        // let data2 = {
        //   user_id: this.loginService.logged_in_user_id,
        //   action: "Report",
        //   action_done: this.event,
        //   action_datetime: new Date()
        // }
        console.log(data);
        this.http.post('http://usc-dcis.com/eligtas.app/report2.php', data, options)
        
        .map(res=> res.json())
        .subscribe((data: any) =>
        {
           // If the request was successful notify the user
           console.log(data);
           let alert = this.alertCtrl.create({
            message: "Report sent successfully!",
            buttons: ['OK']
            });
            // this.navCtrl.setRoot('HcfMappingPage');
            alert.present();
            this.viewCtrl.dismiss();
            //this.navCtrl.setRoot('PilgrimProfilePage'); 
            //this.log();


        },
        (error : any) =>
        {
          console.log(error);
          let alert2 = this.alertCtrl.create({
            title:"FAILED",
            subTitle: "Wrong input/s, try again!",
            buttons: ['OK']
            });

          alert2.present();
        });


      }

  }

}
