import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, NavParams, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public loading:LoadingController, private http: Http, public alertCtrl: AlertController, public navParams: NavParams,
    public loginService: LoginServiceProvider, public events: Events) {
  }

  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  @ViewChild('username') username;
  @ViewChild('password') password; 

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  /**********************************
   * Citizen Login                  *
   *********************************/
  pushCitizenHomePage(){
    this.events.publish('user:sidebar');
    this.navCtrl.push('UserMapPage');
  }

  /**********************************
  * Responder Login                 *
  **********************************/
  pushResponderHomePage(){
    this.events.publish('user:sidebar');
    // this.navCtrl.push('RequestVisualizationPage');
    this.navCtrl.push('RespMapPage');
  }

  changePassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }

  logIn(){
    if(this.username.value==""){
    
      let alert = this.alertCtrl.create({
      subTitle:"Pilgrim ID field is empty",
      buttons: ['OK']
      


      });
      
      alert.present();
    
    } else if(this.password.value==""){
    
      let alert = this.alertCtrl.create({
      subTitle:"Password field is empty",
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
      
      username: this.username.value,
      password: this.password.value
    
      }
      let loader = this.loading.create({
      });
    
      loader.present().then(() => {
        this.http.post('http://usc-dcis.com/eligtas.app/login.php',data,options)
        .map(res=> res.json())
          .subscribe(
            res => {
            loader.dismiss()
            console.log(res)
        
          if(res != "Your username or password is invalid!"){
            this.loginService.loginState = res.specUser_id;
            this.loginService.logged_in_user_id = res.user_id;
            this.loginService.logged_in_user_request_id = res.request_id;
            this.loginService.logged_in_user_name = res.user_name;
            this.events.publish('user:sidebar');
            // this.events.publish('user:sidebar');
            let alert = this.alertCtrl.create({
            subTitle: "You successfully logged in!",
            buttons: ['OK']
            });
            // this.storage.set('username', this.username.value).then((val) =>{
            //   this.storage.get('username').then((val) => {
            //     console.log(val);
            //   });
            // });
            // this.storage.set('password', this.password.value).then((val) =>{
            //   this.storage.get('password').then((val) => {
            //     console.log(val);
            //   });
            // });
            console.log(res.user_id);
            
            alert.present();
            if(this.loginService.loginState == 1){
              this.navCtrl.setRoot('UserMapPage');
            }else{
              // this.navCtrl.setRoot('RequestVisualizationPage');
              this.navCtrl.setRoot('RespMapPage');
            }
            
          }else{
            let alert = this.alertCtrl.create({
            subTitle:"Your Username or Password is invalid",
            buttons: ['OK']
            });
            
            alert.present();
           }
        }); 

        });
    }
  }
}
