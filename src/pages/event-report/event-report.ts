import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import 'rxjs/add/operator/map';
import { elementProperty } from '@angular/core/src/render3/instructions';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { asTextData } from '@angular/core/src/view';

/**
 * Generated class for the EventReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-report',
  templateUrl: 'event-report.html',
})
export class EventReportPage {

  @ViewChild('persons_injured') persons_injured;
  @ViewChild('persons_trapped') persons_trapped;
  @ViewChild('other_info') other_info;

  max_id: any;
  today: number = Date.now();
  event: any;
  lat: any;
  long: any;
  visual: any;
  hear: any;
  walk: any;
  mental: any;
  others: any;
  private currentNumber = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,private http: Http, public loginService: LoginServiceProvider) {
    this.lat = navParams.data.lat;
    this.long = navParams.data.long;

    this.http
      .get('http://usc-dcis.com/eligtas.app/retrieve-max-request.php')
      .map(res => res.json())
      .subscribe((data : any) =>
      {
        // console.dir(data);
        this.max_id = data.max_id + 2;
        console.log(this.max_id);
      },
      (error : any) =>
      {
         console.dir(error);
      });
  }

  private increment () {
    this.currentNumber++;
  }
  
  private decrement () {
    this.currentNumber--;
  }

  visualchanged(e:any, name){
    // console.log(e.checked);
    if(e.checked) {
      this.visual = name;
    } else {
      this.visual = null;
    }
    console.log(this.visual);
  }

  pushChangePin(){
    this.navCtrl.setRoot('ChangePinPage', {
      lat: this.lat,
      long: this.long,
      request: "EventReportPage"
    });
  }

  hearchanged(e:any, name){
    // console.log(e.checked);
    if(e.checked) {
      this.hear = name;
    } else {
      this.hear = null;
    }
    console.log(this.hear);
  }

  walkchanged(e:any, name){
    // console.log(e.checked);
    if(e.checked) {
      this.walk = name;
    } else {
      this.walk = null;
    }
    console.log(this.walk);
  }

  mentalchanged(e:any, name){
    // console.log(e.checked);
    if(e.checked) {
      this.mental = name;
    } else {
      this.mental = null;
    }
    console.log(this.mental);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventReportPage');
    console.log(this.lat, this.long);
    this.persons_injured.value = 0;
    this.persons_trapped.value = 0;
  }
  
  eventfilter(){
    console.log(this.event)
  }

  report(){

    if(this.visual!=null) {
      this.others = this.visual + ", "
    } else {
      this.others = "";
    }
    if(this.hear!=null) {
      this.others = this.others + this.hear + ", "
    } 
    if(this.walk!=null) {
      this.others = this.others + this.walk + ", "
    } 
    if(this.mental!=null) {
      this.others = this.others + this.mental
    }
    console.log(this.others);

    
    // if (this.persons_injured.value==""){
        
    //       let alert = this.alertCtrl.create({
    //         message:"Persons injured field is empty!",
    //         buttons: ['OK']
          
    //       });
          
    //       alert.present();
    //       this.persons_injured.value = 0;
        
    // } else if (this.persons_trapped.value==""){
        
    //       let alert = this.alertCtrl.create({
    //         message:"Persons trapped field is empty!",
    //         buttons: ['OK']
  
    //       });
          
    //       alert.present();
    //       this.persons_trapped.value = 0;
         
    // } else {

        var headers = new Headers();
      
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Headers' , 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        
        
        let options = new RequestOptions({ headers: headers });

        let data = {
          request_type_id : 1,
          person_to_check : null,
          event: this.event,
          persons_injured: this.persons_injured.value,
          persons_trapped: this.persons_trapped.value,
          other_info: this.other_info.value,
          request_lat: this.lat,
          request_long: this.long,
          special_needs: this.others,

          max_id: this.max_id,

          /********** LOG **********/
          user_id: this.loginService.logged_in_user_id,
          action: "Request",
          action_done: this.event,
          action_datetime: new Date()
        }
        // let data2 = {
        //   user_id: this.loginService.logged_in_user_id,
        //   action: "Report",
        //   action_done: this.event,
        //   action_datetime: new Date()
        // }
        console.log(data);
        this.http.post('http://usc-dcis.com/eligtas.app/report.php', data, options)
        
        .map(res=> res.json())
        .subscribe((data: any) =>
        {
           // If the request was successful notify the user
           console.log(data);
           let alert = this.alertCtrl.create({
            message: "Report sent successfully!",
            buttons: ['OK']
            });
            // this.navParams.get("HcfMappingPage").someFnToRefreshParent();
            // this.navCtrl.pop();
            // this.navCtrl.setRoot('HcfMappingPage');
            alert.present();
            this.navCtrl.setRoot('UserMapPage', {
              lat: this.lat,
              long: this.long             
            });
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


      // }

  }

  pushBackToMap(){
    this.navCtrl.setRoot('UserMapPage');
  }

}
