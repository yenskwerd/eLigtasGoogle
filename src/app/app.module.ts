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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { HttpModule, Http } from '@angular/http';
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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LanguagePage } from '../pages/language/language';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    OpenRedCrossPage,
    LanguagePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
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
    OpenRedCrossPage,
    LanguagePage
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
