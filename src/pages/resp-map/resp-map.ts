import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { TranslateService } from '@ngx-translate/core';
import { stringify } from '@angular/core/src/render3/util';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

/**
 * Generated class for the RespMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google:any;


@IonicPage()
@Component({
  selector: 'page-resp-map',
  templateUrl: 'resp-map.html',
})
export class RespMapPage {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  dataRefresher: any;
  dataRefresher2: any;
  statidRefresher: any; 
  requestMarkers: any;
  requestmarkers:any;
  redMarker: any;
  purpleMarker: any;
  yellowMarker: any;
  grayMarker: any;
  blackMarker: any; 
  initialMapLoad: boolean = true;
  eventForReport: any;
  request_id: any;
  markerforongoing: any;
  checkforcallforbackuprefresher:any;

  cfb: any = false;

  map: any;
  // rootPage: any = RespMapPage;
  myDate = new Date();
  m = this.myDate.getMonth() + 1;
  y = this.myDate.getFullYear();
  da = this.myDate.getDate();
  h=this.myDate.getHours();
  mi=this.myDate.getMinutes();
  s=this.myDate.getSeconds();
  datetoday = this.y+"-"+this.m+"-"+this.da+" "+this.h+":"+this.mi+":"+this.s;
  evaccolor2: any = "assets/imgs/user/testmarker.png";
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public geolocation: Geolocation, public http2 : Http, public http : HttpClient, public navParams: NavParams,
    public loginService: LoginServiceProvider, public alertCtrl : AlertController, public localNotifications: LocalNotifications,
    public platform: Platform, public geocoder: NativeGeocoder,
    public translate: TranslateService) {
    this.hcfMarkers = [];
    this.requestMarkers = [];
    this.distanceArr = [];
    this.pmarker = [];
    this.cfbmarker = [];
    this.respondedmarker = [];
    
    this.redMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
    this.purpleMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png";
    this.yellowMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
    this.grayMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
    this.blackMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png";
  }


  ionViewWillEnter() {
    this.loadmap();

    this.loadbackup();
      
    this.statidRefresher = setInterval(() =>{
      this.loginService.resp_stat_id=this.loginService.resp_stat_id;
    },1000);

    var headers = new Headers();
              
  headers.append("Accept", 'application/json');
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Access-Control-Allow-Origin' , '*');
  headers.append('Access-Control-Allow-Headers' , 'Content-Type');
  headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  
  let options = new RequestOptions({ headers: headers });
  let data = {
    user_id: this.loginService.logged_in_user_id
  }

  this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-spec-id.php',data, options)
    .map(res=> res.json())
    .subscribe(
    res => {
      if(res.specUser_id == 2){
        this.loginService.backup = 0;
      }else{
        this.loginService.backup = 1;
      }
    });

    if(this.loginService.loginState == 4 && this.loginService.logged_in_stat_id == 2){
      this.requestChecker();
    }

    if(this.loginService.logged_in_user_request_id != null){
      let data = {
        request_id: this.loginService.logged_in_user_request_id
      }
    
      this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-user-request1.php',data, options)
        .map(res=> res.json())
        .subscribe(
        res => {
          if(res.request_status_id == 0){
            this.refresher1();


            this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-backup-status.php', data, options)
              .map(res=> res.json())
              .subscribe(
              res => {
                if(res.status == 0){
                  this.refresher2();
                }
              });
          }
        });
    }

}

loadbackup(){

  var headers = new Headers();
              
  headers.append("Accept", 'application/json');
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Access-Control-Allow-Origin' , '*');
  headers.append('Access-Control-Allow-Headers' , 'Content-Type');
  headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  
  let options = new RequestOptions({ headers: headers });

  if(this.loginService.logged_in_user_request_id!= null){
    this.status = true;

    let data = {
      request_id: this.loginService.logged_in_user_request_id
    }

    this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-status.php',data, options)
    .map(res=> res.json())
    .subscribe(
    res => {
      if(res.request_status_id == 0){
        this.cfb = true
      }
    });
  }
}


  ionViewWillLeave() {
  clearInterval(this.dataRefresher);
  console.log("nj left");
  }

  /********** Google Maps **********/
  // map: any;
  latLng1: any;
  marker:any;
  marker2: any;
  marker4: any;
  longitude: any;
  latitude: any;
  mapClass: string = "mapClass";
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  user_request_id: any;
  stat_id: any;

  //  watch = this.geolocation.watchPosition();
  

  loadmap(){
    // this.map=null;
    // console.log(this.map)
    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });
    let data = {
      user_id: this.loginService.logged_in_user_id
    }

    this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-user-request.php',data,options)
      .map(res=> res.json())
        .subscribe(
          res => {
            console.log(res)      
            this.user_request_id = res.request_id;
            console.log(res.stat_id);
            this.loginService.resp_stat_id = res.stat_id;
            // this.stat_id= res.stat_id;
            // let watch = this.geolocation.watchPosition();
            this.geolocation.getCurrentPosition().then((position) => {
              // let watch = this.geolocation.watchPosition();
                // watch.subscribe((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                // this.latLng1 = new google.maps.LatLng(10.355158, 123.9184494);
                let mapOptions = {
                  center: this.latLng1,
                  zoom: 14,
                  disableDefaultUI: true,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  // fullscreenControl: true,
                  zoomControl: false,
                  scaleControl: true,
                  clickableIcons: false,
                  streetViewControl:true
                }
                // 10.3813503, 123.9815693
                this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions), {
                  // disableDefaultUI: true,
                  // fullscreenControl: true,
                  zoomControl: false,
                  scaleControl: true,
                  clickableIcons: false
                };
                this.checkcount();
                this.requestMarker();
                // google.maps.event.trigger(this.map,'resize');
                this.addMarker(this.redMarker);
              }, (err) => {
                console.log(err);
              
            });
        //    let alert = this.alertCtrl.create({
        //     title: 'Notifications set',
        //     buttons: ['Ok']
        // });
    
        // alert.present();
      //   this.checkcount();
      // this.requestMarker();
        

    });
  }
  // latlangbounds(){
  //   this.map.lat
  // }
  addMarker(data){
    // this.directionsDisplay.setMap(null);
    // this.directionsDisplay.setPanel(null);
    // this.directionsDisplay.set('directions', null);
    // this.directionsDisplay.set({ suppressMarkers:true });
     this.marker = new google.maps.Marker({
      map: this.map,
      // animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
      icon: data
    });

    let title;
   
    this.translate.get('You').subscribe(
      value => {
        // value is our translated string
        title = value;
    });
   
    let content = "<h6>"+title+"</h6>";
    this.addInfoWindow(this.marker, content);
  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  
  /********* REQUESTS MARKERS *********/
  public status : any=false;
  ctr:any;
  ctrforcfb:any;
  ctrforcfb2=0;
  backuprefresher:any;
  checkcount(){
    this.ctrforcfb=0;
    // this.ctrforcfb2=0;
      if(this.loginService.logged_in_user_request_id!= null){
        this.status = true;
      }
      this.http.get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
      .subscribe((data : any) =>
      {
        console.log(data);
          // this.ctr = data.length;
          this.request = data;
          console.log(this.ctr);
          console.log("DARA: 1");
          for(let i=0; i<data.length; i++){
            // this.createMarker2(data[i]);
            if(data[i].request_status_id == 0){
              this.ctrforcfb=this.ctrforcfb+1;
              console.log(this.ctrforcfb)
            }
            this.createMarker2(data[i],i, 1);
          }
          this.ctr = data.length;
      },
      (error : any) =>
      {
          console.dir(error);
      });
  }

  geolat:any;
  geolong:any;
  distancekm:any;
  requestMarker(){
    // this.ctrforcfb2=0;
    this.dataRefresher = setInterval(() =>{ 
      if(this.loginService.logged_in_user_request_id!= null){
        this.status = true;
      }
      this.http.get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
      .subscribe((data : any) =>
      {
        console.log(data.length);
          this.request = data;
          if(this.ctr!=data.length){
            this.geolat =data[data.length-1].request_lat;
            this.geolong =data[data.length-1].request_long;
            this.ReverseGeocoding(data[data.length-1].request_lat, data[data.length-1].request_long);
            
            this.distancekm=this.getDistance(data[data.length-1].request_lat, data[data.length-1].request_long,this.latitude,this.longitude);
            console.log(this.distancekm);
            if(this.distancekm<1.500){
              this.notification(data[data.length-1].request_type_id, data[data.length-1].event, this.reverseGeocodingResults);
            }
            console.log("DARA: 2");
            for(let i=0; i<data.length; i++){
              // this.createMarker2(data[i]);
              this.createMarker2(data[i],i, 2);
            }
          }else{
            let temp = 0;
          for(let i=0; i<data.length; i++){
            if(data[i].request_status_id == 1 && data.request_id == this.user_request_id){
              this.createMarker2(data[i],i, 3);
            }
            if(data[i].request_status_id == 1 && data.request_id != this.user_request_id){
              this.createMarker2(data[i],i, 4);
              try {
              this.markerforongoing.setVisible(false);
              this.pmarker[i].setVisible(false);
              } catch (error) {
                console.log(error)
              }
            }
            if(data[i].request_status_id == 0){
              temp = temp+1;
              } 
            if(data[i].request_status_id == 3){
              this.createMarker2(data[i],i, 5);
            } 
          }

          if(temp > this.ctrforcfb){
            for(let i=0; i<data.length; i++){
              if(data[i].request_status_id == 0){
                this.createMarker2(data[i],i, 6);
              }
            }

            if(this.loginService.logged_in_stat_id != 2){
              let message;

              this.translate.get('backup4').subscribe(
                value => {
                  // value is our translated string
                  message = value;
              });
                  this.localNotifications.schedule({
                    title: "BACKUP",
                    text: message,
                    data: { mydata: 'My hidden message this is' },
                    trigger:{at: new Date()},
                  });
              }
            }
            this.ctrforcfb = temp;

        }
      this.ctr=data.length;
      },
      (error : any) =>
      {
          console.dir(error);
      });
      // console.log(this.marker2);
    },1000);
  }

  deleterequestMarker(){
    clearInterval(this.dataRefresher)
      if(this.pmarker.length!=0) {
        for(let i=0; i<this.pmarker.length; i++){
          // this.DRMarker(i);
          try {
            this.pmarker[i].setVisible(false);
          } catch (error) {
            console.log(error)
          }
        }
      }
  }

  showrequestMarker(){
    this.requestMarker();
    if(this.pmarker.length!=0) {
      for(let i=0; i<this.pmarker.length; i++){
        // this.DRMarker(i);
        try {
          this.pmarker[i].setVisible(true);
        } catch (error) {
          console.log(error)
        }
      }
    }
}

// DRMarker2(i:any){
//   try {
//     this.pmarker[i].setVisible(true);
//   } catch (error) {
//     console.log(error)
//   }
// }

  reverseGeocodingResults:string;

  ReverseGeocoding(req_lat,req_long){
    var options:NativeGeocoderOptions={
      useLocale:true,
      maxResults:1
    }

    this.geocoder.reverseGeocode(req_lat, req_long, options)
    .then((results: NativeGeocoderReverseResult[])=>{
      this.reverseGeocodingResults=JSON.stringify(results[0].locality+","+results[0].thoroughfare);
      console.log("geocode")
    })
  }

  type: any;
  notifid: any = 0;

  notification(id: any, event: any, realaddressusinggeocode:any) {
    let time;
    if(id == 1 ){
      this.translate.get('Report').subscribe(
        value => {
          // value is our translated string
          this.type = value;
      });
    }else if(id == 2){
      this.translate.get('Help').subscribe(
        value => {
          // value is our translated string
          this.type = value;
      });
    }else{
      this.translate.get('Check').subscribe(
        value => {
          // value is our translated string
          this.type = value;
      });
    }
    this.notifid++;

    this.translate.get(event).subscribe(
      value => {
        // value is our translated string
        event = value;
    });

    let near;

    this.translate.get('near').subscribe(
      value => {
        // value is our translated string
        near = value;
    });

    let temp;

    this.translate.get('Time').subscribe(
      value => {
        // value is our translated string
        temp = value;
    });

    if(realaddressusinggeocode != undefined){
      event = event+" "+near+" "+ realaddressusinggeocode;
    }

    this.http.get('http://usc-dcis.com/eligtas.app/retrieve-time.php')
       .subscribe((data : any) =>
       {  
         console.log("DARA: "+data.CURRENT_TIME);
          time = data.CURRENT_TIME.substring(0, 2)%12;
          time = time + data.CURRENT_TIME.substring(2, 5);
          if(data.CURRENT_TIME.substring(0, 2) <= 12){
            time = time+" PM"
          }else{
            time = time+" AM"
          }
          this.localNotifications.schedule({
            id: this.notifid,
            title: this.type,
            text: event+"\n"+temp+" "+time,
            data: { mydata: 'My hidden message this is' },
            trigger:{at: new Date()},
          });
       },
       (error : any) =>
       {
          console.dir(error);
       });  
  }
  
  // marker22: any[];

  // addMarker2(data, lat, long,i){
    addMarker2(data, lat, long){
    // this.directionsDisplay.setMap(null);
    // this.directionsDisplay.setPanel(null);
    //  this.marker22[i] = new google.maps.Marker({
      this.marker4 = new google.maps.Marker({
      map: this.map,
      // animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(lat), lng: parseFloat(long)},
      icon: data
    });
    // this.marker4.push(this.marker4);
    // return this.marker;
  }
respondedmarker: any[];
pmarker: any[];
cfbmarker: any[];
yellow:any = 0;
count:any = 0;
checkRefresher:any;
  createMarker2(data:any,i:any, EYY:any){
    // createMarker2(data:any){
      // console.log("createmarker2");

      console.log("IM HERE");
  
      if(data.request_status_id==null){
        var lat = data.request_lat;
        var long = data.request_long;

        // const marker = new google.maps.Marker({
        //   position: { lat: parseFloat(lat), lng: parseFloat(long) },
        //   animation: google.maps.Animation.DROP,
        //   map: this.map,
        //   icon: this.purpleMarker   
        // })

        this.pmarker[i] = new google.maps.Marker({
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          // animation: google.maps.Animation.DROP,
          map: this.map,
          icon: this.purpleMarker   
        })
    
        // i show the alert on mark click yeeeeees <3
        let self = this
        // marker3[i].addListener('click', function() {
          this.pmarker[i].addListener('click', function() {
            // self.presentConfirm(data);
            if(self.loginService.logged_in_user_request_id == null || self.loginService.logged_in_stat_id == 3) {
              self.presentConfirm(data);
            } else {
              self.cantAlert();
            }
          });
  
      } 
      else if(data.request_status_id==1 && data.request_id != this.user_request_id){
        var lat = data.request_lat;
        var long = data.request_long;
        // this.markerforongoing = this.addMarker2(this.blackMarker, data.request_lat, data.request_long);
        // try {
        //   this.markerforongoing.setVisible(false);
        // } catch (error) {
        //   console.log(error)
        // }
        // this.respondedmarker[i]=this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
        this.markerforongoing = new google.maps.Marker({
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          // animation: google.maps.Animation.DROP,
          map: this.map,
          icon: this.blackMarker   
        })
        try {
          this.markerforongoing.setVisible(false);
        this.pmarker[i].setVisible(false);
        } catch (error) {
          console.log(error)
        }
       }
      else if(data.request_status_id==1 && data.request_id == this.user_request_id){
        this.marker2 = this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
        // this.respondedmarker[i]=this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
        if(this.loginService.resp_stat_id==2){
        // this.rout(data);
        this.directionsDisplay.setMap(null);
        this.directionsDisplay.setPanel(null);
        // this.directionsDisplay.set('directionsPanel', null);
        this.mapClass = "mapClass";
        this.directionsDisplay.setOptions({suppressMarkers:true});
        this.directionsDisplay.setOptions({suppressPolylines:true})
        }else{
          this.rout(data);
        }
        //condition para igback
        this.eventForReport = data.event;
        this.request_id = data.request_id;
        // this.marker2 = this.addMarker2(this.yellowMarker, data.request_lat, data.request_long,i);
        if(this.yellow==0){
        // this.marker2 = this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
        this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
        this.yellow++;
        // console.log(this.marker4);
        }
      } else if( data.request_status_id==2 ){
        // this.eventForReport = data.event;
        // this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long,i);
        // this.marker2 = this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
        this.respondedmarker[i]=this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);
      }else if( data.request_status_id==3 ){
        // this.eventForReport = data.event;
        // this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long,i);
        this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long);
      } else if (data.request_status_id == 0) {
        console.log("DARA:"+ EYY);
        this.count = this.count + 1;
        var iconnum = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png"

    this.cfbmarker[i] = new google.maps.Marker({
      map: this.map,
      position: {lat: parseFloat(data.request_lat), lng: parseFloat(data.request_long)},
      icon: iconnum
    });

        // this.eventForReport = data.event;
        var headers = new Headers();
        
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Headers' , 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        
        let options = new RequestOptions({ headers: headers });
  
        let data1 = {
          request_id: data.request_id
        }
  
         this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-cfb-num.php',data1,options)
         .map(res=> res.json())
           .subscribe(
             res => {
              // this.callForBackUpMarker(res);
              if (this.loginService.resp_stat_id == 0 && this.loginService.logged_in_user_request_id == data.request_id) {
                this.rout(data);
              } else if(this.loginService.resp_stat_id == 1) {
                this.rout(data);
                // this.trytry = this.LatLng1.distanceTo(leaflet.latLng(data.request_lat,data.request_long));
              } 
              if(this.loginService.resp_stat_id!=2){
                let self = this
                  // this.cfbmarker[i].addListener('click', function() {
                    this.cfbmarker[i].addListener('click', function() {
                    self.cfbRespond(data)
                  });  
              }   
         }); 

         this.checkRefresher = setInterval(() =>{
          let data2 = {
            request_id: data.request_id
          }

          this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-backup-status.php',data2,options)
         .map(res=> res.json())
           .subscribe(
             res => {

              if(res.length == 0){
                try {
                  this.cfbmarker[i].setVisible(false);
                  } catch (error) {
                    console.log(error)
                  }
              }

             });
         }, 5000);

      }

  }

  // callForBackUpMarker(data:any){

  //   console.log(data);
  //   var iconnum = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png"

  //   const cfbmarker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: {lat: parseFloat(data.request_lat), lng: parseFloat(data.request_long)},
  //     icon: iconnum
  //   });

  //   if(this.loginService.resp_stat_id!=2){
  //     let self = this
  //       // this.cfbmarker[i].addListener('click', function() {
  //         cfbmarker.addListener('click', function() {
  //         self.cfbRespond(data)
  //       });  
  //   }   
  // }

  cfbRespond(data) {
    let title, message, cancel, see;
    this.translate.get('Response').subscribe(
      value => {
        // value is our translated string
        title = value;
    });
    this.translate.get('Do').subscribe(
      value => {
        // value is our translated string
        message = value;
    });
    this.translate.get('cancel').subscribe(
      value => {
        // value is our translated string
        cancel = value;
    });
    this.translate.get('See').subscribe(
      value => {
        // value is our translated string
        see = value;
    });
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // this.change1();
          }
        },
        {
          text: see,
          handler: () => {
            console.log('Buy clicked');
            // clearInterval(this.dataRefresher);
            console.log('asdfasdf');
            this.routforETA(data);
            console.log("ETA "+this.eta);
            setTimeout(() => {
            this.navCtrl.push('RespondToRequestPage', {
              backup: "YES",
              request_type_id: data.request_type_id,
              person_to_check: data.person_to_check,
              request_id : data.request_id,
              request_status_id : data.request_status_id, 
              event: data.event,
              persons_injured: data.persons_injured,
              persons_trapped: data.persons_trapped,
              other_info: data.other_info,
              special_needs: data.special_needs,
              request_lat: data.request_lat,
              request_long: data.request_long,
              ETA: this.eta,
              
              option: "CFB"
            });
          }, 900);
          }
        }
      ]
    });
    alert.present();
  }

  cancelConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Response',
      message: 'Do you want really want to cancel request?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // this.change1();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
            // clearInterval(this.dataRefresher);
            this.pushCancel();
          }
        }
      ]
    });
    alert.present();
  }


  responderongoing:any=0;
  x:any;
  y1:any;
  eta:any;

  rout(data){
    // clearInterval(this.dataRefresher);
    this.deleterequestMarker();
    
    this.mapClass = "mapDirClass";
    // this.marker.setMap(null);
    let watch = this.geolocation.watchPosition();
    // this.watch.subscribe((data2) => {
      watch.subscribe((data2) => {
      this.directionsDisplay.setMap(this.map);  
      this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      this.responderongoing=1;
      this.directionsService.route({
          // origin: {lat: position.coords.latitude, lng: position.coords.longitude},
        destination: {lat: data.request_lat, lng: data.request_long},
        // destination: {lat: data.xloc, lng: data.yloc},
        // origin: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
        origin: {lat: data2.coords.latitude, lng: data2.coords.longitude},
        travelMode: google.maps.TravelMode['DRIVING']
      }, (res, status) => {
        if(status == google.maps.DirectionsStatus.OK){
            this.directionsDisplay.setDirections(res);  
            // this.eta=this.y1[6].textContent;
            this.eta=this.directionsDisplay.directions.routes[0].legs[0].duration.text;
            console.log(this.directionsDisplay.directions.routes[0].legs[0].duration.text);
              console.log(this.eta);
            // try {
            //   // this.eta=this.y1[6].textContent;
            //   console.log(this.directionsDisplay.directions.routes[0].legs[0].duration.text);
            //   console.log(this.eta);
            //   /******** UPDATE REQUEST STATUS ID **********/
            //   // var headers = new Headers();
    
            //   // headers.append("Accept", 'application/json');
            //   // headers.append('Content-Type', 'application/x-www-form-urlencoded');
            //   // headers.append('Access-Control-Allow-Origin' , '*');
            //   // headers.append('Access-Control-Allow-Headers' , 'Content-Type');
            //   // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
              
            //   // let options = new RequestOptions({ headers: headers });
            //   // let data2 = {
            //   //   request_id: this.request_id,
            //   //   ETA: y[6].textContent
            //   // }

            //   // this.http2.post('http://usc-dcis.com/eligtas.app/update-request-ETA.php', data2, options)
            //   // .map(res=> res.json())
            //   // .subscribe((data2: any) =>
            //   // {
            //   //   console.log(data2);
            //   // },
            //   // (error : any) =>
            //   // {
            //   //   console.log(error);
            //   //   let alert2 = this.alertCtrl.create({
            //   //     title:"FAILED",
            //   //     subTitle: "Request not updated. huhu!",
            //   //     buttons: ['OK']
            //   //     });

            //   //   alert2.present();
            //   // });
            // } catch (error) {
            //   console.log(error);
            // }

        } else {
            console.warn(status);
        }
      });
    });
    
  }

  routforETA(data){
    
    let watch = this.geolocation.watchPosition();
    // this.watch.subscribe((data2) => {
      watch.subscribe((data2) => {
      this.directionsService.route({
          // origin: {lat: position.coords.latitude, lng: position.coords.longitude},
        destination: {lat: data.request_lat, lng: data.request_long},
        // destination: {lat: data.xloc, lng: data.yloc},
        // origin: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
        origin: {lat: data2.coords.latitude, lng: data2.coords.longitude},
        travelMode: google.maps.TravelMode['DRIVING']
      }, (res, status) => {
        if(status == google.maps.DirectionsStatus.OK){
            this.directionsDisplay.setDirections(res);  
            // this.eta=this.y1[6].textContent;
            this.eta=this.directionsDisplay.directions.routes[0].legs[0].duration.text;
            console.log(this.directionsDisplay.directions.routes[0].legs[0].duration.text);
            console.log(this.eta);
        } else {
            console.warn(status);
        }
      });
    });
    
  }
  
  presentConfirm(data) {
    let title, message, yes, no;

    this.translate.get('Response').subscribe(
      value => {
        // value is our translated string
        title = value;
    });

    this.translate.get('Respond').subscribe(
      value => {
        // value is our translated string
        message = value;
    });

    this.translate.get('Cancel').subscribe(
      value => {
        // value is our translated string
        no = value;
    });

    this.translate.get('See').subscribe(
      value => {
        // value is our translated string
        yes = value;
    });

    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: no,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // this.change1();
            // this.navCtrl.push('RespondToRequestPage');
          }
        },
        {
          text: yes,
          handler: () => {
            console.log('Buy clicked');
            // clearInterval(this.dataRefresher);
            // clearInterval(this.watchrefresher);
            console.log('asdfasdf');
            this.routforETA(data);
            console.log("ETA "+this.eta);
            // console.log("duration"+this.directionsDisplay.directions.routes[0].legs[0].duration.text);
            setTimeout(() => {
              console.log("ETA "+this.eta);
            this.navCtrl.setRoot('RespondToRequestPage', {
              backup: "NO",
              request_type_id: data.request_type_id,
              person_to_check: data.person_to_check,
              request_id : data.request_id,
              request_status_id : data.request_status_id, 
              event: data.event,
              persons_injured: data.persons_injured,
              persons_trapped: data.persons_trapped,
              other_info: data.other_info,
              special_needs: data.special_needs,
              request_lat: data.request_lat,
              request_long: data.request_long,
              ETA: this.eta,
              option: "respond"
            });
          }, 900);
            // this.requestMarker(); 
            console.log("request id: ");
            console.log(data.request_id);
            console.log(data.event);
          }
        }
      ]
    });
    alert.present();
  }

  cantAlert() {
    let message;
    this.translate.get('cannot').subscribe(
      value => {
        // value is our translated string
        message = value;
      });
    let alert = this.alertCtrl.create({
      message: message,
      buttons: ['Okay']
      });
      // this.navCtrl.setRoot('HcfMappingPage');
      alert.present();
  }

  /********* Emergency and HCF buttons *********/
  HCFshow: any = true;
  emergencyshow: any = true;
  evacshow: any = true;
  locationshow:any=true;
  HCFcolor: any = "assets/imgs/user/hcfi.png";
  emergencycolor: any = "assets/imgs/user/emergency.png";
  evaccolor: any = "assets/imgs/user/evac1.png";
  locationshowcolor:any;
  request: any;
  distanceArr: any;
  
  minimum:any;
  index: any;

  showHCF(){
    // this.dataRefresher = setInterval(() =>{

    this.http
       .get('http://usc-dcis.com/eligtas.app/retrieve-hcf.php')
       .subscribe((data : any) =>
       {
          console.log(data);
          this.request = data;
          if(this.HCFshow == true){
            if(this.hcfMarkers.length!=0) {
              for(let i=0; i<this.hcfMarkers.length; i++){
                this.deleteMarker(i);
              }
            }
            this.map.setZoom(12);
            this.HCFcolor = "assets/imgs/user/hcfa.png";
            this.emergencycolor = "assets/imgs/user/emergency.png";
            this.evaccolor = "assets/imgs/user/evac1.png";
            this.HCFshow = false;
            for(let i=0; i<data.length; i++){
              if(data[i].status==1) {
                this.createMarker(data[i], i);
                // this.distanceArr.push({
                //   distance: this.latLng1.distanceTo(leaflet.latLng(data[i].xloc,data[i].yloc)),
                //   xloc: data[i].xloc,
                //   yloc: data[i].yloc
                // });
              }
            }
            // this.route(data);
            console.log("true");
          }else{
            this.directionsDisplay.setMap(null);
            this.directionsDisplay.setPanel(null);
            this.mapClass = "mapClass";
            // this.map.setZoom(15);
            this.HCFcolor = "assets/imgs/user/hcfi.png";
            this.HCFshow = true;
            for(let i=0; i<this.hcfMarkers.length; i++){
              this.deleteMarker(i);
            }
            console.log("false");
          }
          
       },
       (error : any) =>
       {
          console.dir(error);
       });  
      // },1000);
  }
  
  showEmergency(){
    
    this.http
       .get('http://usc-dcis.com/eligtas.app/retrieve-emergencies.php')
       .subscribe((data : any) =>
       {
          console.log(data);
          this.request = data;
          if(this.emergencyshow == true){
            if(this.hcfMarkers.length!=0) {
              for(let i=0; i<this.hcfMarkers.length; i++){
                this.deleteMarker(i);
              }
            }
            this.map.setZoom(12);
            
            this.emergencycolor = "assets/imgs/user/emergency2.png";
            this.HCFcolor = "assets/imgs/user/hcfi.png";
            this.evaccolor = "assets/imgs/user/evac1.png";
            this.emergencyshow = false;
            for(let i=0; i<data.length; i++){
              if(data[i].status==1) {
                this.createMarker(data[i], i);
              }
            }
            // for(let i=0; i<data.length; i++){
            //   if(data[i].status==1) {
            //     this.hcfMarkers[i] = new google.maps.Marker({
            //       map: this.map,
            //       animation: google.maps.Animation.DROP,
            //       position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
            //       icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
            //     });
            //   }
            // }
            console.log("true");
            //code para sa iglick sa emergency marker
            // this.route(this.distanceArr[this.index]);
          }else{
            this.directionsDisplay.setMap(null);
            this.directionsDisplay.setPanel(null);
            this.mapClass = "mapClass";
            // this.map.setZoom(15);
            this.emergencycolor = "assets/imgs/user/emergency.png";
            this.emergencyshow = true;
            for(let i=0; i<this.hcfMarkers.length; i++){
              this.deleteMarker(i);
            }
            console.log("false");
          }

       },
       (error : any) =>
       {
          console.dir(error);
       });  
  }

  showevac(){
    // this.map.locate({
    //   setView: true,
    //   maxZoom: 13
    // });
    
    this.http
       .get('http://usc-dcis.com/eligtas.app/retrieve-evac.php')
       .subscribe((data : any) =>
       {
          console.log(data);
          this.request = data;
          if(this.evacshow == true){
            if(this.hcfMarkers.length!=0) {
              for(let i=0; i<this.hcfMarkers.length; i++){
                this.deleteMarker(i);
              }
            }
            this.map.setZoom(12);
            
            this.evaccolor = "assets/imgs/user/evac.png";
            this.HCFcolor = "assets/imgs/user/hcfi.png";
            this.emergencycolor = "assets/imgs/user/emergency.png";
            this.evacshow = false;
            for(let i=0; i<data.length; i++){
              if(data[i].status==1) {
                this.createMarker(data[i], i);
              }
            }
            // for(let i=0; i<data.length; i++){
            //   if(data[i].status==1) {
            //     this.hcfMarkers[i] = new google.maps.Marker({
            //       map: this.map,
            //       animation: google.maps.Animation.DROP,
            //       position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
            //       icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
            //     });
            //   }
            // }
            console.log("true");
          }else{
            this.directionsDisplay.setMap(null);
            this.directionsDisplay.setPanel(null);
            this.mapClass = "mapClass";
            // this.requestMarker();
            // this.map.setZoom(15);
            this.evaccolor = "assets/imgs/user/evac1.png";
            this.evacshow = true;
            for(let i=0; i<this.hcfMarkers.length; i++){
              this.deleteMarker(i);
            }
            console.log("false");
          }
          
       },
       (error : any) =>
       {
          console.dir(error);
       });  
  }
  
  /********** RECENTER ************/
  recenter() {
    this.map.setCenter(this.latLng1);
    this.map.setZoom(15);
  }


  /********** SHOW MARKERS ************/
  hcfMarkers: any[];
  hospital1: any = {
    url: "assets/imgs/user/hospital1.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  hospital2: any = {
    url: "assets/imgs/user/hospital2.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  hospital: any = {
    url: "assets/imgs/user/hospital.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  chu: any = {
    url: "assets/imgs/user/chu.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  bhs: any = {
    url: "assets/imgs/user/bhs.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  rhu: any = {
    url: "assets/imgs/user/health.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  evacuation: any = {
    url: "assets/imgs/user/pav1.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  firestation: any = {
    url: "assets/imgs/user/fstn.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  sports: any = {
    url: "assets/imgs/user/gym.png", // url
    scaledSize: new google.maps.Size(50, 50), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };

  police: any = {
    url: "assets/imgs/user/police.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };

  createMarker(data:any, i:any){

    
    if(data.hcf_type == 1){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png'
        // icon: 'assets/imgs/user/emergencymarker.png',
        icon: this.hospital1
      });
    }else if(data.hcf_type == 2){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.hospital2
      });
    }else if(data.hcf_type == 3){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png'
        icon: this.hospital
      });
    }else if(data.hcf_type == 4){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.chu
      });
    }else if(data.hcf_type == 5){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.bhs
      });
    }else if(data.hcf_type == 6){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.rhu
      });
    }else if(data.hcf_type == 7){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.evacuation
      });
    }else if(data.hcf_type == 8){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.firestation
      });
    }else if(data.hcf_type == 9){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.sports
      });
    }else if(data.hcf_type == 10){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
        // icon: 'assets/imgs/user/evacmarker.png'
        icon: this.police
      });
    }else{
        this.hcfMarkers[i] = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
          icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png'
        });
      }

    let self = this
        // marker3[i].addListener('click', function() {
          this.hcfMarkers[i].addListener('click', function() {
            // self.presentConfirm(data);
            if(data.hcf_type == 1 || data.hcf_type == 2 || data.hcf_type == 3){
              self.route(data);
            } else {
              self.routeforemergency(data);
              // console.log("hcf route di pwede")
            }
          });
    let content = data.name;
    this.addInfoWindow(this.hcfMarkers[i], content);
  }
  /******** END SHOW MARKERS **********/

  /********** UNSHOW MARKERS ************/
  deleteMarker(i:any){
    try {
      this.hcfMarkers[i].setMap(null);
    } catch (error) {
      console.log(error)
    }
  }
  /******** END UNSHOW MARKERS **********/


  routeforemergency(data){
    // clearInterval(this.dataRefresher);
    // this.markerGroup2.clearLayers();

    this.mapClass = "mapDirClass";
    // this.marker.setMap(null);
    let watch = this.geolocation.watchPosition();
    // this.watch.subscribe((data2) => {
      watch.subscribe((data2) => {
        // this.marker.setMap(null);
      this.directionsDisplay.setMap(this.map);  
      // this.directionsDisplay.setOptions({suppressMarkers:true});
      this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      
      this.directionsService.route({
          // origin: {lat: position.coords.latitude, lng: position.coords.longitude},
        destination: {lat: data.request_lat, lng: data.request_long},
        // destination: {lat: data.xloc, lng: data.yloc},
        // origin: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
        origin: {lat: data2.coords.latitude, lng: data2.coords.longitude},
        travelMode: google.maps.TravelMode['DRIVING']
      }, (res, status) => {

        if(status == google.maps.DirectionsStatus.OK){
            this.directionsDisplay.setDirections(res);
                          
        } else {
            console.warn(status);
        }
      });
    });
    
  }
  
  /******** BUTTON FUNCTIONS **********/
  start(){

    this.loginService.resp_stat_id = 1;

    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');  
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data1 = {
      /********** LOG **********/
      user_id: this.loginService.logged_in_user_id,
      action: "Started Navigating",
      action_datetime: this.datetoday
    }
    
    console.log(data1);
    this.http2.post('http://usc-dcis.com/eligtas.app/log.php', data1, options)
    
    .map(res=> res.json())
    .subscribe((data1: any) =>
    {
       // If the request was successful notify the user
       let message;
            this.translate.get('StartNav').subscribe(
            value => {
              // value is our translated string
              message = value;
            });
       let alert = this.alertCtrl.create({
        message: message,
        buttons: ['OK']
        });
        // this.navCtrl.setRoot('HcfMappingPage');
        alert.present();
        //this.navCtrl.setRoot('PilgrimProfilePage'); 
        //this.log();


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
    
    let data2 = {
      user_id: this.loginService.logged_in_user_id,
      stat_id: 1
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-stat.php', data2, options)
    .map(res=> res.json())
    .subscribe(() =>
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
  }

  pushArrive() {
    // this.map.removeControl(this.control);
    // this.stat_id=2;

    this.loginService.logged_in_stat_id = 2;

    if(this.loginService.loginState == 4){
      this.loginService.resp_stat_id=4;

    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
    // this.directionsDisplay.set('directionsPanel', null);
    this.mapClass = "mapClass";
    this.directionsDisplay.setOptions({suppressMarkers:true});
    this.directionsDisplay.setOptions({suppressPolylines:true});

      var headers = new Headers();
      
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Headers' , 'Content-Type');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      
      let options = new RequestOptions({ headers: headers });

      let data = {
        /********** LOG **********/
        user_id: this.loginService.logged_in_user_id,
        action: "Backup",
        action_datetime: this.datetoday,
        request_id: this.loginService.logged_in_user_request_id
      }
      
      console.log(data);
      this.http2.post('http://usc-dcis.com/eligtas.app/log.php', data, options)
    
    .map(res=> res.json())
    .subscribe((data: any) =>
    {
      let message;
      this.translate.get('Arrived').subscribe(
        value => {
          // value is our translated string
          message = value;
      });
       let alert = this.alertCtrl.create({
        message: message,
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              console.log('Buy clicked');
            }
          }
        ]
      });
        alert.present();


    }, (error : any) => {
      console.log(error);
      let alert2 = this.alertCtrl.create({
        title:"FAILED 1",
        subTitle: "Something went wrong!",
        buttons: ['OK']
        });

      alert2.present();
    });

    let data2 = {
      user_id: this.loginService.logged_in_user_id,
      stat_id: 2
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-stat.php', data2, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
    },
    (error : any) =>
    {
      console.log(error);
      let alert2 = this.alertCtrl.create({
        title:"FAILED 2",
        subTitle: "Something went wrong!",
        buttons: ['OK']
        });

      alert2.present();
    });

    if(this.loginService.logged_in_user_request_id == null){
      console.log("DARA: "+this.request_id)
    }

    let data3 = {
      user_id: this.loginService.logged_in_user_id,
      request_id: this.loginService.logged_in_user_request_id
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-backup-status.php', data3, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
    },
    (error : any) =>
    {
      console.log(error);
      let alert2 = this.alertCtrl.create({
        title:"FAILED 3",
        subTitle: "Something went wrong!",
        buttons: ['OK']
        });

      alert2.present();
    });

    let data4 = {
      request_id: this.loginService.logged_in_user_request_id,
      request_status_id: 2
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-request.php', data4, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
    },
    (error : any) =>
    {
      console.log(error);
      let alert2 = this.alertCtrl.create({
        title:"FAILED 4",
        subTitle: "Something went wrong!",
        buttons: ['OK']
        });

      alert2.present();
    });

    this.requestChecker();

    }else{

    this.responderongoing=0;

    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data = {
      /********** LOG **********/
      user_id: this.loginService.logged_in_user_id,
      action: "Arrived",
      action_datetime: this.datetoday,
      request_id: this.request_id
    }
    
    console.log(data);
    this.http2.post('http://usc-dcis.com/eligtas.app/log.php', data, options)
    
    .map(res=> res.json())
    .subscribe((data: any) =>
    {
      let yes, no;
      this.translate.get('Yes').subscribe(
        value => {
          // value is our translated string
          yes = value;
      });
      this.translate.get('No').subscribe(
        value => {
          // value is our translated string
          no = value;
      });
      let message;
          this.translate.get('Call').subscribe(
            value => {
              // value is our translated string
              message = value;
          });


      let alert = this.alertCtrl.create({

        // title: 'Patient'
        message: message+"?",
        buttons: [
          {
            text: no,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              // this.change1();
              this.opendisposition();
            }
          },
          {
            text: yes,
            handler: () => {
              console.log('Buy clicked');
              this.loginService.resp_stat_id=2;
              this.requestCallForBackUp();
            }
          }
        ]
      });
        // this.navCtrl.setRoot('HcfMappingPage');
        alert.present();


      //  let alert = this.alertCtrl.create({

      //   // title: 'Patient',
      //   message: 'Do you see the victim?',
      //   buttons: [
      //     {
      //       text: 'No',
      //       role: 'cancel',
      //       handler: () => {
      //         console.log('Cancel clicked');
      //         // this.change1();
      //       }
      //     },
      //     {
      //       text: 'Yes',
      //       handler: () => {
      //         console.log('Buy clicked');
      //         this.loginService.resp_stat_id=2;
      //         let alert1 = this.alertCtrl.create({

      //           // title: 'Patient',
      //           message: 'Call for backup?',
      //           buttons: [
      //             {
      //               text: 'No',
      //               role: 'cancel',
      //               handler: () => {
      //                 console.log('Cancel clicked');
      //                 this.opendisposition();
      //               }
      //             },
      //             {
      //               text: 'Yes',
      //               handler: () => {
      //                 console.log('Buy clicked');
      //                 this.requestCallForBackUp();
                      
      //               }
      //             }
      //           ]
      //         });
      //           // this.navCtrl.setRoot('HcfMappingPage');
      //           alert1.present();
      //       }
      //     }
      //   ]
      // });
      //   // this.navCtrl.setRoot('HcfMappingPage');
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


    let data2 = {
      user_id: this.loginService.logged_in_user_id,
      stat_id: 2
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-stat.php', data2, options)
    .map(res=> res.json())
    .subscribe(() =>
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
        subTitle: "Please check your connection and try again!",
        buttons: ['OK']
        });

      alert2.present();
    });

    let data4 = {
      request_id: this.request_id,
      request_status_id: 2
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-request.php', data4, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
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
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
    // this.directionsDisplay.set('directionsPanel', null);
    this.mapClass = "mapClass";
    this.directionsDisplay.setOptions({suppressMarkers:true});
    this.directionsDisplay.setOptions({suppressPolylines:true});
    // this.requestMarker();

    }
    
  }

  datarefresher : any;


  requestChecker(){

    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data = {
      request_id: this.loginService.logged_in_user_request_id
    }

    this.datarefresher = setInterval(() =>{
      this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-status.php', data, options)
      .map(res=> res.json())
      .subscribe( res =>
      {
        if(res.request_status_id == 3){
          clearInterval(this.datarefresher);
          this.endBackup();
        }
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
    }, 1000);
  }

  endBackup(){
    var headers = new Headers();
      
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data = {
      user_id: this.loginService.logged_in_user_id
    }

    this.http2.post('http://usc-dcis.com/eligtas.app/update-backup.php', data, options)
      .map(res=> res.json())
      .subscribe( res =>
      {
        let message;
        this.translate.get('done').subscribe(
          value => {
            // value is our translated string
            message = value;
        });
        let alert2 = this.alertCtrl.create({
          subTitle: message,
          buttons: ['OK']
          });

        alert2.present();

        this.loginService.loginState = 2;
        this.loginService.logged_in_stat_id = 0;
        this.loginService.logged_in_user_request_id = null;

        this.navCtrl.push(RespMapPage);
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

  

  requestCallForBackUp(){

    let title, message, reason, resources, submit, cancel
    this.translate.get('Call').subscribe(
      value => {
        // value is our translated string
        title = value;
    });
    this.translate.get('Reason').subscribe(
      value => {
        // value is our translated string
        reason = value;
    });
    this.translate.get('Resources').subscribe(
      value => {
        // value is our translated string
        resources = value;
    });
    this.translate.get('submit').subscribe(
      value => {
        // value is our translated string
        submit = value;
    });
    this.translate.get('cancel').subscribe(
      value => {
        // value is our translated string
        cancel = value;
    });
    this.translate.get('Fill').subscribe(
      value => {
        // value is our translated string
        message = value;
    });



    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      inputs: [
        {
          name: 'reason',
          placeholder: reason
        },
        {
          name: 'resources',
          placeholder: resources
        }
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: submit,
          handler: data => {
            this.sendBackup(data);
          }
        }
      ]
    });
    alert.present();
  }

  dataRefresher1: any;
  CTR: any;

  sendBackup(datas: any){
      if(this.loginService.logged_in_user_request_id == null){
        this.loginService.logged_in_user_request_id = this.request_id;
      }

          var headers = new Headers();
          
          headers.append("Accept", 'application/json');
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          headers.append('Access-Control-Allow-Origin' , '*');
          headers.append('Access-Control-Allow-Headers' , 'Content-Type');
          headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
          
          let options = new RequestOptions({ headers: headers });
           
        /******** UPDATE REQUEST STATUS ID **********/


        let data2 = {
          request_id: this.loginService.logged_in_user_request_id,
          request_status_id: 0
        }

        console.log(data2);
    
        this.http2.post('http://usc-dcis.com/eligtas.app/update-request1.php', data2, options)
        .map(res=> res.json())
        .subscribe((data2: any) =>
        {
          console.log(data2);
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
            subTitle: "Please check your connection and try again!",
            buttons: ['OK']
            });
    
          alert2.present();
        });
        
        /********** LOG **********/
        let data3 = {
          user_id: this.loginService.logged_in_user_id,
          action: "Callback",
          action_datetime: this.datetoday,
          request_id: this.loginService.logged_in_user_request_id
        }
        
        this.http2.post('http://usc-dcis.com/eligtas.app/log.php', data3, options)
        
        .map(res=> res.json())
        .subscribe((data3: any) =>
        {
           console.log(data3);
        },
        (error : any) =>
        {
          console.log(error);
        });
        /********** END OF LOG **********/

        let data4 = {
          request_id: this.loginService.logged_in_user_request_id,
          reason: datas.reason,
          resources: datas.resources
        }

        this.http2.post('http://usc-dcis.com/eligtas.app/backup.php', data4, options)
        
        .map(res=> res.json())
        .subscribe((data4: any) =>
        {
           console.log(data4);
        },
        (error : any) =>
        {
          console.log(error);
        });
    
        this.cfb = true;


        this.refresher1();
        this.refresher2();
        this.checkcount();
        this.requestMarker();
        this.CTR = 1;
  }
  

  data: any;
  temp: any = 0;

  refresher1(){
    console.log("DARA: BOOOOOOOMMMMMMMM");
    this.data = setInterval(() =>{

      var headers = new Headers();

      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Headers' , 'Content-Type');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      
      let options = new RequestOptions({ headers: headers });

      
      /******** UPDATE REQUEST STATUS ID **********/
      let data2 = {
        request_id: this.loginService.logged_in_user_request_id
      }

      this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-status.php', data2, options)
      .map(res=> res.json())
      .subscribe((data: any) =>
      {
        if(data.request_status_id != 0){
          this.temp = this.temp + 1;
        }
        if(this.temp != 0){
          clearInterval(this.data);
          this.cfb = false;
          console.log("DARA: ANOTHER WAN");
          this.checkforcallforbackup();

          let title, message;

          this.translate.get('Backup').subscribe(
            value => {
              // value is our translated string
              title = value;
          });

          this.translate.get('backup').subscribe(
            value => {
              // value is our translated string
              message = value;
          });

          this.temp = 0;
          this.localNotifications.schedule({
            id: 1,
            title: title,
            text: message,
            trigger:{at: new Date()},
          });
          this.CTR = 0;
        }
      },
      (error : any) =>
      {
        console.log(error);
        let alert2 = this.alertCtrl.create({
          title:"FAILED",
          subTitle: "Request not updated!",
          buttons: ['OK']
          });

        alert2.present();
      });

    },5000);

  }

  refresher2(){
    this.dataRefresher1 = setInterval(() =>{
      var headers = new Headers();

      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Headers' , 'Content-Type');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      
      let options = new RequestOptions({ headers: headers });

      let data = {
        request_id: this.loginService.logged_in_user_request_id
      }

      this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-backup-status.php', data, options)
      .map(res=> res.json())
      .subscribe((data: any) =>
      {
        if(data.status != 0){
          clearInterval(this.dataRefresher1);

          let title, message;

          this.translate.get('Backup2').subscribe(
            value => {
              // value is our translated string
              title = value;
          });

          this.translate.get('backup2').subscribe(
            value => {
              // value is our translated string
              message = value;
          });


          this.localNotifications.schedule({
            id: 1,
            title: title,
            text: message,
            data: { mydata: 'My hidden message this is' },
            trigger:{at: new Date()},
          });
        }
      },
      (error : any) =>
      {
        console.log(error);
        let alert2 = this.alertCtrl.create({
          title:"FAILED",
          subTitle: "Request not updated!",
          buttons: ['OK']
          });

        alert2.present();
      });

    }, 5000);
  }

  checkforcallforbackup(){
    this.checkforcallforbackuprefresher = setInterval(() =>{
      var headers = new Headers();

      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Headers' , 'Content-Type');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      
      let options = new RequestOptions({ headers: headers });

      let data = {
        request_id: this.loginService.logged_in_user_request_id
      }

      this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-backup-status.php', data, options)
      .map(res=> res.json())
      .subscribe((data: any) =>
      {
        console.log("DARA: "+data.length)
        if(data.length == undefined){
          clearInterval(this.checkforcallforbackuprefresher);
          this.cfb=true;

          let title;
   
          this.translate.get('backup3').subscribe(
            value => {
              // value is our translated string
              title = value;
          });
          this.localNotifications.schedule({
            id: 1,
            title: "BACKUP",
            text: title,
            trigger:{at: new Date()},
          });
          if(this.CTR != 1){
            this.refresher1();
            this.refresher2();
          }
        }
      },
      (error : any) =>
      {
        console.log(error);
        clearInterval(this.checkforcallforbackuprefresher);
      });

    }, 1000);
  }

  pushDone() {
    this.responderongoing=0;
    this.loginService.resp_stat_id=3;
    // if(this.loginService.logged_in_user_request_id!= null){
    //   this.status = true;
    // }
    var headers = new Headers();
    
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

     
    /******** UPDATE REQUEST STATUS ID **********/
    let data2 = {
      request_id: this.request_id,
      request_status_id: 2
    }

    this.http2.post('http://usc-dcis.com/eligtas.app/update-request.php', data2, options)
    .map(res=> res.json())
    .subscribe((data2: any) =>
    {
      console.log(data2);
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
        subTitle: "Please check your connection and try again!",
        buttons: ['OK']
        });

      alert2.present();
    });
    
    /********** LOG **********/
    let data3 = {
      user_id: this.loginService.logged_in_user_id,
      action: "Rescued",
      action_datetime: this.datetoday,
      request_id: this.request_id
    }
    
    this.http2.post('http://usc-dcis.com/eligtas.app/log.php', data3, options)
    
    .map(res=> res.json())
    .subscribe((data3: any) =>
    {
      console.log(data3);
    },
    (error : any) =>
    {
      console.log(error);
    });
    /********** END OF LOG **********/

    
    let data4 = {
      user_id: this.loginService.logged_in_user_id,
      stat_id: 3
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-stat.php', data4, options)
    .map(res=> res.json())
    .subscribe(() =>
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
    try {
      this.directionsDisplay.setMap(null);
      this.directionsDisplay.setPanel(null);
      // this.directionsDisplay.set('directionsPanel', null);
      this.mapClass = "mapClass";
      this.directionsDisplay.setOptions({suppressMarkers:true});
      this.directionsDisplay.setOptions({suppressPolylines:true});
      // this.requestMarker();
      this.showrequestMarker();
    } catch (error) {
      console.log(error)
    }
  }

  pushCancel() {
    // document.getElementById("hh").style.display = "none";
    console.log("clicked cancel");
    this.responderongoing=0;
    this.user_request_id = null;
    this.loginService.resp_stat_id=0;
    
    var headers = new Headers();
    
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

     
    /******** UPDATE REQUEST STATUS ID **********/
    let data2 = {
      request_id: this.request_id,
      request_status_id: "NULL"
    }

    this.http2.post('http://usc-dcis.com/eligtas.app/update-request.php', data2, options)
    .map(res=> res.json())
    .subscribe((data2: any) =>
    {
      console.log(data2);
      // If the request was successful notify the user
      //  console.log(data2);
      //  let alert = this.alertCtrl.create({
      //   message: "You have started navigating(???)",
      //   buttons: ['OK']
      //   });
      //   alert.present();
      // this.marker.setMap(null);
      // this.directionsDisplay.setMap(null);
      // this.directionsDisplay.setPanel(null);
  // this.directionsDisplay.set('directions', null);
  //  this.directionsDisplay.set({ suppressMarkers:true });
  //  this.addMarker();
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

    
    let data4 = {
      user_id: this.loginService.logged_in_user_id,
      stat_id: 0
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-stat.php', data4, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
       // If the request was successful notify the user
      //  console.log(data2);
      //  let alert = this.alertCtrl.create({
      //   message: "You have started navigating(???)",
      //   buttons: ['OK']
      //   });
      //   alert.present();
      // this.marker.setMap(null);
      // this.directionsDisplay.setMap(null);
      // this.directionsDisplay.setPanel(null);
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

    let data5 = {
      user_id: this.loginService.logged_in_user_id,
      // request_id: "NULL"
    }
    this.http2.post('http://usc-dcis.com/eligtas.app/update-stat2.php', data5, options)
    .map(res=> res.json())
    .subscribe(() =>
    {
       // If the request was successful notify the user
      //  console.log(data2);
      //  let alert = this.alertCtrl.create({
      //   message: "You have started navigating(???)",
      //   buttons: ['OK']
      //   });
      //   alert.present();
      // this.marker.setMap(null);
      // this.directionsDisplay.setMap(null);
      // this.directionsDisplay.setPanel(null);
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
    try {
      this.directionsDisplay.setMap(null);
      this.directionsDisplay.setPanel(null);
      // this.directionsDisplay.set('directionsPanel', null);
      this.mapClass = "mapClass";
      this.directionsDisplay.setOptions({suppressMarkers:true});
      this.directionsDisplay.setOptions({suppressPolylines:true});
      this.checkcount();
      // this.showrequestMarker();
    } catch (error) {
      console.log(error)
    }
  }

  // deleteyellow(){
  //   this.marker2.setMap(null);
  //   this.yellow--;
  // }

  /***** REPORT MODAL ******/
  public openReport(){ 
    console.log(this.eventForReport, this.user_request_id)
    var modalPage = this.modalCtrl.create('ReportPage', {
      event: this.eventForReport,
      request_id: this.user_request_id,
    });
    modalPage.present(); 
  }

  llat:any;
  llong:any;
  marker3:any;

  addMarker3(){
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
     this.marker3 = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(this.llat), lng: parseFloat(this.llong)},
      icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_white.png'
    });
  }

  showlastlocation(){
    var headers = new Headers();
        
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Headers' , 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        
        let options = new RequestOptions({ headers: headers });
  
        let data1 = {
          request_id: this.loginService.logged_in_user_request_id,
          specUser_id: 1
        }
  
         this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-user-request2.php',data1,options)
         .map(res=> res.json())
           .subscribe(
             res => {
               console.log(res.laslat);
               this.llat=res.lastlat;
               this.llong=res.lastlong;
         }); 
         console.log(this.llat)
         console.log(this.llong)
    if(this.locationshow == true){
      // this.locationshowcolor = "assets/imgs/user/evac.png";
      this.locationshow = false;
      this.addMarker3();
    }else{
      // this.locationshowcolor = "assets/imgs/user/evac1.png";
      this.locationshow = true;
      console.log("false");
      this.marker3=null;
    }
  }

  
  
  hospitalshow: any = true;
  hosimage: any = "assets/imgs/user/ambu1.png";

  emergencyhospital() {
      this.http
       .get('http://usc-dcis.com/eligtas.app/retrieve-hcf.php')
       .subscribe((data : any) =>
       {
          console.log(data);
          for(let i=0; i<data.length; i++){
            // console.log(this.getDistance(this.latitude, this.longitude, data[i].xloc, data[i].yloc));
            this.distanceArr.push({
                distance: this.getDistance(this.latitude, this.longitude, data[i].xloc, data[i].yloc),
                xloc: data[i].xloc,
                yloc: data[i].yloc
            });
          }
        if(this.hospitalshow==true) {
          this.minimum = this.distanceArr[0].distance;
          this.index = 0;
          
          for(let i=1; i<this.distanceArr.length; i++){
            if(this.distanceArr[i].distance<this.minimum){
              this.minimum = this.distanceArr[i].distance;
              this.index = i;
            }
          }

          this.route(this.distanceArr[this.index]);
          this.hospitalshow=false;
          this.hosimage = "assets/imgs/user/ambu.png";
        } else {
          this.hosimage ="assets/imgs/user/ambu1.png";
          this.mapClass = "mapClass";
          this.directionsDisplay.setMap(null);
          this.directionsDisplay.setPanel(null);
          this.hospitalshow = true;
        }
       },
       (error : any) =>
       {
          console.dir(error);
       });  
  }

  getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
  }

  route(data){
    this.mapClass = "mapDirClass";
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
    this.directionsService.route({
            origin: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
            destination: {lat: data.xloc, lng: data.yloc},
            travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {
      if(status == google.maps.DirectionsStatus.OK){
        this.directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }
    });
  }
  
  opendisposition(){
    this.directionsDisplay.setMap(null);
      this.directionsDisplay.setPanel(null);
      // this.directionsDisplay.set('directionsPanel', null);
      this.mapClass = "mapClass";
      this.directionsDisplay.setOptions({suppressMarkers:true});
      this.directionsDisplay.setOptions({suppressPolylines:true})
      if(this.request_id != null){
        this.loginService.logged_in_user_request_id = this.request_id
      }

    this.navCtrl.push('PersonstatusPage',{
      request_id: this.loginService.logged_in_user_request_id,
    });
  }

}
