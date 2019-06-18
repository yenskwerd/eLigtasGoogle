import { Component, ViewChild } from '@angular/core';
import { Nav, AlertController, Platform, App, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { HistoryPage } from '../pages/history/history';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  username: any;

  rootPage: any = HomePage;
  mainmenu: {icon:string, title: string, component: any}; 
  pages: Array<{icon:string, title: string, component: any}>;

  extrapages: Array<{icon:string, title: string, component: any}>;
  submenus: Array<{icon:string, title: string, component: any}>;
  home: Array<{icon:string, title: string, component: any}>;
  shownGroup = null;
 
  constructor(public platform: Platform, public geolocation: Geolocation, private http: Http, public app: App, public alertCtrl: AlertController, private push: Push, public menuCtrl: MenuController, public statusBar: StatusBar, public events: Events, public splashScreen: SplashScreen, public loginService: LoginServiceProvider) {
    this.initializeApp();

    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position.coords.latitude);
      // this.lastlong = position.coords.longitude;
    });

    events.subscribe('user:sidebar', () => {
      this.username = this.loginService.logged_in_user_name;
      this.createSidebar();
      this.pushSetup();
    });

    this.extrapages = [
      { icon: 'log-out', title:'Log out', component: HomePage}
    ];

    
    this.submenus = [
      { icon: "medkit", title: 'First Aid App', component: ""},
      { icon: 'filing', title: 'View Reports', component: ""},
      { icon: 'globe', title: 'Batingaw App', component: ""},
      { icon: 'medkit', title: 'Red Cross App', component: ""},
      { icon: 'locate', title: 'Google Maps', component: ""},
      { icon: 'globe', title: 'MIMS App', component: ""}
    ];

    // this.pages = [
    //   { icon: '', title: 'Go to First Aid App', component: ""},
    //   { icon: '', title: 'PDCAT Calculator', component: ""},
    //   { icon: '', title: 'View Reports', component: ""},
    //   { icon: '', title: 'Go to Batingaw App', component: ""},
    //   { icon: '', title: 'Go to Red Cross App', component: ""},
    //   { icon: '', title: 'Go to Google Maps', component: ""},
    //   { icon: '', title: 'Go to MIMS App', component: ""},
    //   { icon: '', title: 'Logout', component: HomePage}
    // ]; 
    
  }
  pushSetup(){
    const options: PushOptions = {
      android: {
        senderID: this.loginService.logged_in_user_id
         
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
     
   };
   
   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('notification').subscribe((data:any) => {
    console.log('Received a notification', data);
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: 'HELLO',
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push(HomePage, { message: 'Hello' });
            }
          }]
        });
        
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push(HomePage, { message: data.message });
        console.log('Push notification clicked');
      }
    });
   
   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  }
  isGroupShown(group) {
      return this.shownGroup === group;
  }

  createSidebar(){
        this.pages = [
          { icon: "time", title: 'History', component: HistoryPage},
          { icon: 'settings', title: 'Settings', component: ""}
        ];
        this.mainmenu = { icon: 'apps', title: 'Apps', component: ""};
  }

  initializeApp(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  // logoutClicked() {
  //   console.log("Logout");
  //   //this.authService.logout();
  //   this.menuCtrl.close();
  //   var nav = this.app.getRootNav();
  //   //nav.setRoot(LoginPage);
  // }

  openPage(page) {
   this.nav.push(page.component);
  }
  lastlat:any;
  lastlong:any;
  logout(page) {
    
    var headers = new Headers();
    
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });
    let data2 = {
      user_id: this.loginService.logged_in_user_id,
      loginStatus: 0
    }
    this.http.post('http://usc-dcis.com/eligtas.app/update-login.php', data2, options)
    .map(res=> res.json())
    .subscribe((data2: any) =>
    {
      console.log("here2")
       //insert code here
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

    this.geolocation.getCurrentPosition().then((position) => {
      this.lastlat = position.coords.latitude;
      this.lastlong = position.coords.longitude;
    });

    let data = {
      user_id: this.loginService.logged_in_user_id,
      lastlat: this.lastlat,
      lastlong: this.lastlong
    }

    this.http.post('http://usc-dcis.com/eligtas.app/update-lastloc.php', data, options)
    .map(res => res.json())
    .subscribe((data: any) => {

    }, (error: any) => {
      console.log(error);

      let alert2 = this.alertCtrl.create({
        title: "FAILED",
        subTitle: "Something went wrong",
        buttons: ['OK']
      });
      alert2.present();
    })
    
    this.nav.setRoot(page.component);
   }

  // pages: Array<{title: string, component: any}>;

  // constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
  //   this.initializeApp();

  //   // used for an example of ngFor and navigation
  //   this.pages = [
  //     { title: 'Home', component: HomePage },
  //     { title: 'List', component: ListPage }
  //   ];

  // }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   });
  // }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }
}
