import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

// import { RequestVisualizationPage } from '../request-visualization/request-visualization';
/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  public items : any = [];
  history: any = [];
  blueMarker: any;
  yellowMarker: any;
  grayMarker: any;
  blackMarker:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http   : Http, public loginService: LoginServiceProvider) {
    this.blueMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png";
    this.yellowMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
    this.blackMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png";
    this.grayMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
    this.load();
    
  }


  load() : void
  {
    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data = {
      user_id: this.loginService.logged_in_user_id
    }

     this.http.post('http://usc-dcis.com/eligtas.app/retrieve-history1.php',data,options)
    //  .map(res=> res.json())
    //    .subscribe(
    //      res => {
    //       this.items = res;
    //       this.generateHistory(res);
    //       console.log(res);
    //  });  
    .map(res=> res.json())
    .subscribe((data: any) =>
    {
       console.log(data);
       this.items = data;
       this.generateHistory(data);
    },
    (error : any) =>
    {
      console.dir(error);
    }); 
  }

  earthquake:any= "assets/imgs/user/eq.png";
  fire:any= "assets/imgs/user/fire.png";
  flood:any= "assets/imgs/user/flood.png";
  zerostatusid:any=this.blueMarker;
  onestatusid:any=this.yellowMarker;
  twostatusid:any=this.grayMarker;

  firepic:any;
  
  generateHistory(data) {
    console.log(data);
    for (let i=0; i < data.length; i++) {
      if(data[i].event=="Fire" && data[i].request_status_id == "NULL"){
      
        this.history.push(
          { request_id: data[i].request_id,
            action: data[i].action,
            action_datetime: data[i].action_datetime,
            event: this.fire,
            request_status_id: this.blackMarker
          }
        );
        }else if(data[i].event=="Fire" && data[i].request_status_id == 0){
      
      this.history.push(
        { request_id: data[i].request_id,
          action: data[i].action,
          action_datetime: data[i].action_datetime,
          event: this.fire,
          request_status_id: this.blueMarker
        }
      );
      }else if(data[i].event=="Fire" && data[i].request_status_id == 1){
      
        this.history.push(
          { request_id: data[i].request_id,
            action: data[i].action,
            action_datetime: data[i].action_datetime,
            event: this.fire,
            request_status_id: this.yellowMarker
          }
        );
        }else if(data[i].event=="Fire" && data[i].request_status_id == 2){
      
          this.history.push(
            { request_id: data[i].request_id,
              action: data[i].action,
              action_datetime: data[i].action_datetime,
              event: this.fire,
              request_status_id: this.grayMarker
            }
          );
          }else if(data[i].event=="Fire" && data[i].request_status_id == "NULL"){
      
            this.history.push(
              { request_id: data[i].request_id,
                action: data[i].action,
                action_datetime: data[i].action_datetime,
                event: this.fire,
                request_status_id: this.blackMarker
              }
            );
            }else if(data[i].event=="Earthquake" && data[i].request_status_id == 0){
      
          this.history.push(
            { request_id: data[i].request_id,
              action: data[i].action,
              action_datetime: data[i].action_datetime,
              event: this.earthquake,
              request_status_id: this.blueMarker
            }
          );
          }else if(data[i].event=="Earthquake" && data[i].request_status_id == 1){
      
            this.history.push(
              { request_id: data[i].request_id,
                action: data[i].action,
                action_datetime: data[i].action_datetime,
                event: this.earthquake,
                request_status_id: this.yellowMarker
              }
            );
            }else if(data[i].event=="Earthquake" && data[i].request_status_id == 2){
      
              this.history.push(
                { request_id: data[i].request_id,
                  action: data[i].action,
                  action_datetime: data[i].action_datetime,
                  event: this.earthquake,
                  request_status_id: this.grayMarker
                }
              );
              }else if(data[i].event=="Fire" && data[i].request_status_id == "NULL"){
      
                this.history.push(
                  { request_id: data[i].request_id,
                    action: data[i].action,
                    action_datetime: data[i].action_datetime,
                    event: this.fire,
                    request_status_id: this.blackMarker
                  }
                );
                }else if(data[i].event=="Flood" && data[i].request_status_id == 0){
      
            this.history.push(
              { request_id: data[i].request_id,
                action: data[i].action,
                action_datetime: data[i].action_datetime,
                event: this.flood,
                request_status_id: this.blueMarker
              }
            );
      }else if(data[i].event=="Flood" && data[i].request_status_id == 1){
      
        this.history.push(
          { request_id: data[i].request_id,
            action: data[i].action,
            action_datetime: data[i].action_datetime,
            event: this.flood,
            request_status_id: this.yellowMarker
          }
        );
  }else if(data[i].event=="Flood" && data[i].request_status_id == 2){
      
    this.history.push(
      { request_id: data[i].request_id,
        action: data[i].action,
        action_datetime: data[i].action_datetime,
        event: this.flood,
        request_status_id: this.grayMarker
      }
    );
}
    }
  }

}
