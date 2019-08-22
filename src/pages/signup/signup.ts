import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  options: any;
  options2: any;

  constructor(public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,private http: Http) {
  }

  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.swipeEnable(true);
  }
  
  @ViewChild('user_email') user_email;
  @ViewChild('user_name') user_name;
  @ViewChild('user_password') user_password;

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  optionfilter() {
    console.log(this.options);
  }
  optionfilter2() {
    console.log(this.options2);
  }

  signUp(){
    if(this.user_email.value==""){
        
          let alert = this.alertCtrl.create({
            message:"Email field is empty!",
            buttons: ['OK']
          
          });
          
          alert.present();
        
        } else if(this.user_name.value==""){
        
          let alert = this.alertCtrl.create({
            message:"Username field is empty!",
            buttons: ['OK']
  
          });
          
          alert.present();
         
      }else {
        var headers = new Headers();
      
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Headers' , 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        
        
        let options = new RequestOptions({ headers: headers });
        let data = {
          user_email: this.user_email.value,
          user_name: this.user_name.value,
          user_password: this.user_password.value,
          regUser_id: 1,
          specUser_id: this.options2
        }
        console.log(data);
        this.http.post('http://usc-dcis.com/eligtas.app/signup.php', data, options)
        .map(res=> res.json())
        .subscribe((data: any) =>
        {
           // If the request was successful notify the user
           console.log(data);
           let alert = this.alertCtrl.create({
            message: "Account created successfully!",
            buttons: ['OK']
            }); 
            this.navCtrl.setRoot('LoginPage');
            alert.present();
            //this.navCtrl.setRoot('PilgrimProfilePage'); 
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

}
