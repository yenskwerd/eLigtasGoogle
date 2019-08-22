import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ReportMorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-more',
  templateUrl: 'report-more.html',
})
export class ReportMorePage {
  @ViewChild('victim_name') victim_name;
  @ViewChild('victim_desc') victim_desc;
  data: any;
  triage: any;
  victim_nametext: any;
  victim_desctext: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private http: Http, public navParams: NavParams) {
    this.data = this.navParams.data.data;
    console.log(this.data);
    this.victim_nametext = this.data.victim_name;
    this.victim_desctext = this.data.victim_desc;
    this.triage = this.data.triage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportMorePage');
  }

  update() {
    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });
    let data = {
        report_id: this.data.report_id,
        victim_name: this.victim_name.value,
        victim_desc: this.victim_desc.value,
        triage: this.triage,
    }
  
      this.http.post('http://usc-dcis.com/eligtas.app/update-report.php',data,options)
      .map(res=> res.json())
        .subscribe(
          res => {
            console.log(res)
            let alert2 = this.alertCtrl.create({
              title:"SUCCESS",
              subTitle: "Report successfully updated!",
              buttons: ['OK']
              });
      
            alert2.present();
            this.navCtrl.pop();
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
  }

}
