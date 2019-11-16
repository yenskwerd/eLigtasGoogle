import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserMapPage } from '../user-map/user-map';
import { AppModule } from '../../app/app.module';

/**
 * Generated class for the ChangeNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-name',
  templateUrl: 'change-name.html',
})

export class ChangeNamePage {

  @ViewChild('name') name;
  username:any;
  lengthofusername:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public login: LoginServiceProvider,
    public alertCtrl: AlertController,
    private http: Http,
    private storage: Storage,
    private splashscreen: SplashScreen,
    public appCtrl: App) {

    this.username = this.login.logged_in_user_name;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeNamePage');
  }

  changeName(){
    this.lengthofusername=this.username.value;
    if(this.name.value == this.username){
      let alert = this.alertCtrl.create({
        message:"Cant use old name",
        buttons: ['OK']

      });
      alert.present();
    }else if(this.lengthofusername<5){
      let alert = this.alertCtrl.create({
        message:"Username must have at least 5 characters.",
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
      name: this.name.value
    }
    this.http.post('http://usc-dcis.com/eligtas.app/update-name.php', data2, options)
    .map(res=> res.json())
    .subscribe((data2: any) =>
    {
      let alert2 = this.alertCtrl.create({
        message:"Successfully changed user name",
        buttons: ['OK']
        });

      alert2.present();
      this.login.logged_in_user_name = this.name.value;
      this.storage.set('name', this.name.value);
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
