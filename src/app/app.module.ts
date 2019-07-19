import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { UserHomePage } from '../pages/user-home/user-home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { HttpModule } from '@angular/http';
import { HTTP, HTTPOriginal } from '@ionic-native/http';
import { HistoryPage } from '../pages/history/history';
import { Push } from '@ionic-native/push'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { IonicStorageModule } from '@ionic/storage'
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { OpenBatingawPage } from '../pages/open-batingaw/open-batingaw';
import { OpenFaultFinderPage } from '../pages/open-fault-finder/open-fault-finder';
import { OpenGoogleMapsPage } from '../pages/open-google-maps/open-google-maps';
import { OpenRedCrossPage } from '../pages/open-red-cross/open-red-cross';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    HistoryPage,
    UserHomePage,
    OpenBatingawPage,
    OpenFaultFinderPage,
    OpenGoogleMapsPage,
    OpenRedCrossPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    HistoryPage,
    UserHomePage,
    OpenBatingawPage,
    OpenFaultFinderPage,
    OpenGoogleMapsPage,
    OpenRedCrossPage
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    Push,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginServiceProvider,
    LocalNotifications,
    NativeGeocoder
  ]
})
export class AppModule {}
