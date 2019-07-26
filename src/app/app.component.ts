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
import { Storage } from '@ionic/storage';
import { OpenBatingawPage } from '../pages/open-batingaw/open-batingaw';
import { OpenRedCrossPage } from '../pages/open-red-cross/open-red-cross';
import { OpenGoogleMapsPage } from '../pages/open-google-maps/open-google-maps';
import { OpenFaultFinderPage } from '../pages/open-fault-finder/open-fault-finder';
import { TranslateService } from '@ngx-translate/core';
import { LanguagePage } from '../pages/language/language';
import { LegendPage } from '../pages/legend/legend';
import { ProfilePage } from '../pages/profile/profile';
import { StepsPage } from '../pages/steps/steps';
import { PersonstatusPage } from '../pages/personstatus/personstatus';

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
  submenus2: Array<{icon:string, title: string, component: any}>;
  home: Array<{icon:string, title: string, component: any}>;
  shownGroup = null;
  shownGroup2 = null;
 
  constructor(public platform: Platform, 
    public geolocation: Geolocation, 
    private http: Http, public app: App, 
    public alertCtrl: AlertController, 
    private push: Push, 
    public menuCtrl: MenuController, 
    public statusBar: StatusBar, 
    public events: Events, 
    public splashScreen: SplashScreen, 
    public loginService: LoginServiceProvider,
    public storage: Storage,
    public translate: TranslateService) {

    translate.setDefaultLang('en');
    
    this.initializeApp();

    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position.coords.latitude);
      // this.lastlong = position.coords.longitude;
    });

    events.subscribe('user:sidebar', () => {
      this.username = this.loginService.logged_in_user_name;
      this.createSidebar();
    });

    this.extrapages = [
      { icon: 'log-out', title:'Log out', component: HomePage}
    ];

    
    this.submenus = [
      { icon: 'globe', title: 'Batingaw App', component: OpenBatingawPage},
      { icon: 'medkit', title: 'Red Cross App', component: OpenRedCrossPage},
      { icon: 'locate', title: 'Google Maps', component: OpenGoogleMapsPage},
      { icon: 'globe', title: 'Fault Finder', component: OpenFaultFinderPage},
    ];
    
    this.submenus2 = [
      { icon: 'medkit', title: 'Profile', component: ProfilePage},
      { icon: 'locate', title: 'Legends', component: LegendPage},
      { icon: 'globe', title: 'Language', component: LanguagePage},
      { icon: 'globe', title: 'Steps', component: StepsPage},
    ];

    events.subscribe('user:login', () => {
      this.switchLanguage();
    });

  }

  switchLanguage(){
    this.translate.use(this.loginService.language);
  }

  message(): void {
    alert("jssjs");
  
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

  toggleGroup2(group) {
    if (this.isGroupShown2(group)) {
        this.shownGroup2 = null;
    } else {
        this.shownGroup2 = group;
    }
  }
  isGroupShown2(group) {
      return this.shownGroup2 === group;
  }

  createSidebar(){
        this.pages = [
          { icon: "time", title: 'History', component: HistoryPage},
          // { icon: 'settings', title: 'Settings', component: ""}
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

  openPage(page) {
   this.nav.push(page.component);
  }

  lastlat:any;
  lastlong:any;
  logout(page) {

    this.storage.clear()
    
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

  
}
