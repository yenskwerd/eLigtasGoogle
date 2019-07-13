import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { RequestOptions, Headers, Http} from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, 
      public menuCtrl: MenuController,
      public storages: Storage,
      public loading:LoadingController,
      private http: Http,
      public loginService: LoginServiceProvider,
      public events: Events,
      public alertCtrl: AlertController) {

    storages.get('name').then((name) => {
      if(name != null){
        storages.get('password').then((pass => {

          var headers = new Headers();
      
          headers.append("Accept", 'application/json');
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          headers.append('Access-Control-Allow-Origin' , '*');
          headers.append('Access-Control-Allow-Headers' , 'Content-Type');
          headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');

          let options = new RequestOptions({ headers: headers });
          let data = {
          username: name,
          password: pass
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
            
              if(res != "Your username or password is invalid or you may have already logged in on another device!"){
                this.loginService.loginState = res.specUser_id;
                this.loginService.logged_in_user_id = res.user_id;
                this.loginService.logged_in_user_request_id = res.request_id;
                this.loginService.logged_in_user_name = res.user_name;
                this.loginService.logged_in_user_password = res.user_password;
                this.loginService.logged_in_stat_id = res.stat_id;
                this.loginService.lastlat = res.lastlat;
                this.loginService.lastlong = res.lastlong;
                this.events.publish('user:sidebar');
                // this.events.publish('user:sidebar');
                let alert = this.alertCtrl.create({
                  subTitle: "You successfully logged in!",
                  buttons: ['OK']
                });
                console.log(res.user_id);
                
                alert.present();
                if(this.loginService.loginState == 1){
                  this.navCtrl.setRoot('UserMapPage');
                }else{
                  // this.navCtrl.setRoot('RequestVisualizationPage');
                  this.navCtrl.setRoot('RespMapPage');
                }
    
                let data2 = {
                  user_id: this.loginService.logged_in_user_id,
                  // loginStatus: 1
                }
                this.http.post('http://usc-dcis.com/eligtas.app/update-login.php', data2, options)
                .map(res=> res.json())
                .subscribe((data2: any) =>
                {
                   // If the request was successful notify the user
                  //  console.log(data2);
                  //  let alert = this.alertCtrl.create({
                  //   message: "You have started navigating(???)",
                  //   buttons: ['OK']
                  //   });
                  //   alert.present();
                },
                (error : any) =>
                {
                  console.log(error);
                  let alert2 = this.alertCtrl.create({
                    title:"FAILED",
                    subTitle: "Something went wrong!",
                    buttons: ['OK']
                    });
            
                  alert2.present();
                });
                
              }else{
                let alert = this.alertCtrl.create({
                subTitle:"Your username or password is invalid or you may have already logged in on another device!",
                buttons: ['OK']
                });
                
                alert.present();
               }
            }); 
    
            });

        }));
      }
    });

  }
  
  // ionViewWillEnter() {
  //   this.menuCtrl.swipeEnable(false);
  // }

  PushSignupPage(){
    this.navCtrl.push('SignupPage');
  }

  PushLoginPage(){
    this.navCtrl.push('LoginPage');
  }
}
