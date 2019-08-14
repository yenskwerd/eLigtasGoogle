import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
import { OverlaystepsPage } from '../overlaysteps/overlaysteps';
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
  @ViewChild('other') other;

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
  limitinjured:any;
  limittrapped:any;
  myDate = new Date();
  m = this.myDate.getMonth() + 1;
  y = this.myDate.getFullYear();
  da = this.myDate.getDate();
  h=this.myDate.getHours();
  mi=this.myDate.getMinutes();
  s=this.myDate.getSeconds();
  datetoday = this.y+"-"+this.m+"-"+this.da+" "+this.h+":"+this.mi+":"+this.s;
  buttonClicked: boolean = false;
  private currentNumber = 0;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl:AlertController,
    private http: Http, 
    public loginService: LoginServiceProvider,
    public translate: TranslateService,
    public modalCtrl: ModalController,) {
      
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
  
  eventfilter(e:any, value){
    // console.log(this.event)
    this.event=value;
    console.log(this.event);
  }

  eqshow: any = true;
  fireshow: any = true;
  floodshow: any = true;

  eqcolor: any = "assets/imgs/user/eq1.png";
  firecolor: any = "assets/imgs/user/fire1.png";
  floodcolor: any = "assets/imgs/user/flood1.png";
  othercolor: any = "assets/imgs/user/other1.png";

  request: any;
  distanceArr: any;
  
  minimum:any;
  index: any;

  showeq(e:any, value){
            this.firecolor = "assets/imgs/user/fire1.png";
            this.eqcolor = "assets/imgs/user/eq.png";
            this.floodcolor = "assets/imgs/user/flood1.png";
            this.othercolor = "assets/imgs/user/other1.png";
            this.eqshow = false;
            this.buttonClicked = false;
            this.event=value;
            console.log(this.event)
  }
  
  showfire(e:any, value){
            this.firecolor = "assets/imgs/user/fire.png";
            this.eqcolor = "assets/imgs/user/eq1.png";
            this.floodcolor = "assets/imgs/user/flood1.png";
            this.othercolor = "assets/imgs/user/other1.png";
            this.fireshow = false;
            this.buttonClicked = false;
            this.event=value;
            console.log(this.event)
  }

  showflood(e:any, value){
    this.floodcolor = "assets/imgs/user/flood.png";
    this.eqcolor = "assets/imgs/user/eq1.png";
    this.firecolor = "assets/imgs/user/fire1.png";
    this.othercolor = "assets/imgs/user/other1.png";
    this.floodshow = false;
    this.buttonClicked = false;
    this.event=value;
    console.log(this.event)
  }

  showOthers(e:any, value){
    this.floodcolor = "assets/imgs/user/flood1.png";
    this.eqcolor = "assets/imgs/user/eq1.png";
    this.firecolor = "assets/imgs/user/fire1.png";
    this.othercolor = "assets/imgs/user/others.png";
    // this.floodshow = false;
    this.event=value;
    this.buttonClicked = true;
    console.log(this.event)
}
  
  checkreport(){
    if(this.persons_injured.value<10 && this.persons_trapped.value<10){
      if(this.event == "Others"){
        if(this.other.value == ""){
          let alert = this.alertCtrl.create({
            message:"State the event",
            buttons: ['OK']
            });
          alert.present();
        }else{
          this.event = this.other.value;
          this.report();
        }
      }else{
        this.report();
      }
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
    
    
    if (this.event==null){
        
          let alert = this.alertCtrl.create({
            message:"No event selected.",
            buttons: ['OK']
          
          });
          
          alert.present();
          // this.persons_injured.value = 0;
        
    // } else if (this.persons_trapped.value==""){
        
    //       let alert = this.alertCtrl.create({
    //         message:"Persons trapped field is empty!",
    //         buttons: ['OK']
  
    //       });
          
    //       alert.present();
    //       this.persons_trapped.value = 0;
         
    } else {

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
          action_datetime: this.datetoday
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
            let message;
            this.translate.get('ReportSent').subscribe(
            value => {
              // value is our translated string
              message = value;
            });
           let alert = this.alertCtrl.create({
            message: message,
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
            var modal = this.modalCtrl.create(OverlaystepsPage, {
            });
            modal.present();
            
            modal.onDidDismiss((result) =>{
              // if(result){
              //   console.log(result);
              //   this.passPage = result;
              // }
              console.log("steps");
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


      }

  }

  pushBackToMap(){
    this.navCtrl.pop();
  }

}
