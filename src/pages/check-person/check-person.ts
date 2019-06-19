import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
/**
 * Generated class for the CheckPersonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-check-person',
  templateUrl: 'check-person.html',
})
export class CheckPersonPage {
  lat: any;
  long: any;
  event: any;
  visual: any;
  hear: any;
  walk: any;
  mental: any;
  others: any;
  max_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,private http: Http, public loginService: LoginServiceProvider) {
    this.lat = navParams.data.lat;
    this.long = navParams.data.long;
    // console.log(new Date());

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

  pushChangePin(){
    this.navCtrl.setRoot('ChangePinPage', {
      lat: this.lat,
      long: this.long,
      request: "EventReportPage"
    });
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

  @ViewChild('person_to_check') person_to_check;
  @ViewChild('persons_injured') persons_injured;
  @ViewChild('persons_trapped') persons_trapped;
  @ViewChild('other_info') other_info;

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckPersonPage');
    console.log(this.lat, this.long);
    this.persons_injured.value = 0;
    this.persons_trapped.value = 0;
  }

  eventfilter(){
    console.log(this.event)
  }

  eqshow: any = true;
  fireshow: any = true;
  floodshow: any = true;
  eqcolor: any = "assets/imgs/user/eq1.png";
  firecolor: any = "assets/imgs/user/fire1.png";
  floodcolor: any = "assets/imgs/user/flood1.png";

  request: any;
  distanceArr: any;
  
  minimum:any;
  index: any;

  showeq(e:any, value){
          if(this.eqshow == true){
            this.eqcolor = "assets/imgs/user/eq.png";
            this.eqshow = false;
            this.event=value;
            console.log(this.event)
          }else{
            this.eqcolor = "assets/imgs/user/eq1.png";
            this.eqshow = true;
            console.log("false");
          }
  }
  
  showfire(e:any, value){
          if(this.fireshow == true){
            this.firecolor = "assets/imgs/user/fire.png";
            this.fireshow = false;
            this.event=value;
            console.log(this.event)
          }else{
            this.firecolor = "assets/imgs/user/fire1.png";
            this.fireshow = true;
            console.log("false");
          }
  }

  showflood(e:any, value){
          if(this.floodshow == true){
            this.floodcolor = "assets/imgs/user/flood.png";
            this.floodshow = false;
            this.event=value;
            console.log(this.event)
          }else{
            this.floodcolor = "assets/imgs/user/flood1.png";
            this.floodshow = true;
            console.log("false");
          }
  }
  limitinjured:any;
  limittrapped:any;
  checkreport(){
    if(this.persons_injured.value<10 && this.persons_trapped.value<10){
      // this.limitinjured=this.persons_injured.value;   
      // this.limittrapped=this.persons_trapped.value;  
      this.report();       
    }
    else{
      let alert = this.alertCtrl.create({
                message:"Number of injured/trapped is over the limit",
                buttons: ['OK']
      
              });
              alert.present();
    }
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

    if(this.person_to_check.value==""){
        
          let alert = this.alertCtrl.create({
            message:"Person to check field is empty!",
            buttons: ['OK']
          
          });
          
          alert.present();
        
    // } else if(this.persons_trapped.value==""){
        
    //       let alert = this.alertCtrl.create({
    //         message:"Persons trapped field is empty!",
    //         buttons: ['OK']
  
    //       });
          
    //       alert.present();
         
    } else {
        var headers = new Headers();
      
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Headers' , 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        
        
        let options = new RequestOptions({ headers: headers });
        let data = {
          request_type_id : 3,
          person_to_check : this.person_to_check.value,
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
        console.log(data);
        this.http.post('http://usc-dcis.com/eligtas.app/report.php', data, options)
        .map(res=> res.json())
        .subscribe((data: any) =>
        {
           // If the request was successful notify the user
           console.log(data);
           let alert = this.alertCtrl.create({
            message: "Request sent successfully!",
            buttons: ['OK']
            }); 
            // this.navCtrl.pop();
            this.navCtrl.setRoot('UserMapPage', {
              lat: this.lat,
              long: this.long             
            });
            alert.present();
            //this.navCtrl.setRoot('PilgrimProfilePage'); 
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

  pushBackToMap(){
    this.navCtrl.setRoot('UserMapPage');
  }

}
