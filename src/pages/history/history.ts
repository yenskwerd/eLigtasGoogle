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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http   : Http, public loginService: LoginServiceProvider) {
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

  eventpic:any= "assets/imgs/user/eq1.png";
  generateHistory(data) {
    console.log(data);
    for (let i=0; i < data.length; i++) {
      // if(data[i].event==0){
      //   data[i].event=this.eventpic;
      // }
      this.history.push(
        { request_id: data[i].request_id,
          action: data[i].action,
          action_datetime: data[i].action_datetime,
          event: data[i].event,
          request_status_id: data[i].request_status_id
        }
      );
    }
  }

}
