import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { HttpClient } from '@angular/common/http'; 

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  public items : Array<any> = [];
  reports: any = [];
  value: any = [];
  hello: any;
  event: any;
  request_id: any;

  constructor(public viewCtrl : ViewController, public modalCtrl: ModalController, private http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    this.hello = navParams.data.data;
    this.event = navParams.data.event;
    this.request_id = navParams.data.request_id;
  }

  public openModal(){ 
    console.log(this.request_id)
    var modalPage = this.modalCtrl.create('ModalPage', {
      event: this.event,
      request_id: this.request_id
    });
    modalPage.onDidDismiss(data => {
      console.log(data);
      this.value.push(data);//here
      console.log(this.value)
      // console.log(JSON.stringify(this.value,undefined,2));
    });
    modalPage.present(); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
    this.load();
  }


  load() : void
  {
     this.http
     .get('http://usc-dcis.com/eligtas.app/retrieve-report.php')
     .subscribe((data : any) =>
     {
        console.dir(data);
        this.items = data;
        console.log("this: " + this.items);
        this.generateItems(data);
     },
     (error : any) =>
     {
        console.dir(error);
     });
  }

  generateItems(data) {
    for (let i=0; i < data.length; i++) {
      if(data[i].victim_name != "" && data[i].request_id == this.request_id && data[i].event == this.event) {
        this.reports.push(
          { victim_name: data[i].victim_name,
            victim_desc: data[i].victim_desc,
            triage: data[i].triage
          }
        );
      }
    }
  }

  public closeModal(){
    // let data = { 
    //   victim_name: this.victim_name.value,
    //   victim_desc: this.victim_desc.value,
    //   event: this.event,
    //   request_id: this.request_id,
    //   triage: this.triage
    // }
    this.viewCtrl.dismiss();
  }

  reportmore(data) {
    this.navCtrl.push('ReportMorePage', {
      data: data
    });
  }
}
