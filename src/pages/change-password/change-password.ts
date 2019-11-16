import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  @ViewChild('old') old;
  @ViewChild('new') new;
  @ViewChild('verify') verify;

  patt:any;
  res:any;
  lengthofpassword:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public login: LoginServiceProvider,
    public alertCtrl: AlertController,
    private http: Http,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePassword(){
    this.lengthofpassword=this.old.value;
    this.patt = new RegExp("^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$");
    this.res=this.patt.test(this.old.value);
    console.log(this.res);

    if(this.old.value != this.login.logged_in_user_password){
      let alert = this.alertCtrl.create({
        message:"Wrong Password",
        buttons: ['OK']

      });
      alert.present();
    }else if(this.new.value != this.verify.value){
      let alert = this.alertCtrl.create({
        message:"Please enter the same new password",
        buttons: ['OK']

      });
      alert.present();
    }else if(this.new.value == this.old.value){
      let alert = this.alertCtrl.create({
        message:"Cant use old password",
        buttons: ['OK']

      });
      alert.present();
    }else if(this.lengthofpassword.length<8 || this.res!=true){
      let alert = this.alertCtrl.create({
        message:"Password must have at least 8 characters and must have uppercase, lowercase characters and number.",
        buttons: ['OK']

      });
      alert.present();
    }else{
      var headers = new Headers();
    
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });
    let data2 = {
      user_id: this.login.logged_in_user_id,
      user_password: this.new.value
    }
    this.http.post('http://usc-dcis.com/eligtas.app/update-password.php', data2, options)
    .map(res=> res.json())
    .subscribe((data2: any) =>
    {
      let alert2 = this.alertCtrl.create({
        message:"Successfully changed password",
        buttons: ['OK']
        });

      alert2.present();
      this.login.logged_in_user_password = this.new.value;
      this.storage.set('password', this.new.value);
      this.navCtrl.pop();
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

  back(){
    this.navCtrl.pop();
  }

}
