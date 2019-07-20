import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RequestOptions, Http, Headers } from '@angular/http';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  @ViewChild('email') email;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public http : Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  back(){
    this.navCtrl.pop();
  }

  sendEmail(){
    if(this.email.value == ""){
      let alert = this.alertCtrl.create({
        message:"Enter Email",
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

    let data = {
      email: this.email.value
    }

     this.http.post('http://usc-dcis.com/eligtas.app/retrieve-id.php',data,options)
    .map(res=> res.json())
    .subscribe((data: any) =>
    {
      if(data.length == 0){
        let alert = this.alertCtrl.create({
          message:"This email address has no corresponding user",
          buttons: ['OK']
        });
        alert.present();
      }else{
        let data2 = {
          to: this.email.value,
          subject: "E-Ligtas Forgot Password",
          message: "Dear "+data[0].user_name+"\n\nGreetings from E-Ligtas!\n\nPlease be informed that your "+
              "account password has been reset successfully.\n\nYou may now access your Account using your new password: R6CoP7eE2J\n\n"+
              "Should you have any questions or clarifications, you may email us at sample@gmail.com.\n\n"+
              "E-Ligtas"    
        }
        this.http.post('http://usc-dcis.com/eligtas.app/send-email.php', data2, options)
        .map(res=> res.json())
        .subscribe((data2: any) =>
        {
          
        },
        (error : any) =>
        {
          console.log("DIRI "+ error);
        
        });

      }
    },
    (error : any) =>
    {
      console.dir(error);
    }); 
  }
    }
  
}
