import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { HistoryPage } from '../pages/history/history';
import { LoginServiceProvider } from '../providers/login-service/login-service';

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
 
  constructor(public platform: Platform, public app: App, public menuCtrl: MenuController, public statusBar: StatusBar, public events: Events, public splashScreen: SplashScreen, public loginService: LoginServiceProvider) {
    this.initializeApp();

    events.subscribe('user:sidebar', () => {
      this.username = this.loginService.logged_in_user_name;
      this.createSidebar();
    });

    
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
        this.extrapages = [
          { icon: 'log-out', title:'Log out', component: HomePage}
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

  openPage2(page) {
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
