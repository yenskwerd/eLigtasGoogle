import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
import { LocalNotifications } from '@ionic-native/local-notifications';

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
    public platform: Platform) {
    this.hcfMarkers = [];
    this.requestMarkers = [];
    this.distanceArr = [];
    
// this.redMarker=this.evaccolor2;
    this.redMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
    this.purpleMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png";
    this.yellowMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
    this.grayMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
    this.blackMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png";
  }


  ionViewWillEnter() {
    this.loadmap();
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
            this.stat_id = res.stat_id;
            // let watch = this.geolocation.watchPosition();
            this.geolocation.getCurrentPosition().then((position) => {
              // let watch = this.geolocation.watchPosition();
                // this.watch.subscribe((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                // this.latLng1 = new google.maps.LatLng(10.355158, 123.9184494);
                let mapOptions = {
                  center: this.latLng1,
                  zoom: 14,
                  disableDefaultUI: true,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  fullscreenControl: true,
                  zoomControl: false,
                  scaleControl: true,
                  clickableIcons: false,
                  streetViewControl:true
                }
                // 10.3813503, 123.9815693
                this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions), {
                  disableDefaultUI: true,
                  fullscreenControl: true,
                  zoomControl: false,
                  scaleControl: true,
                  clickableIcons: false
                };
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
        this.checkcount();
      this.requestMarker();
        

    });
  }

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
   
   
    let content = "<h6>You are here!</h6>";
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

  checkcount(){
      if(this.loginService.logged_in_user_request_id!= null){
        this.status = true;
      }
      this.http.get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
      .subscribe((data : any) =>
      {
        console.log(data);
          this.ctr = data.length;
          this.request = data;
          console.log(this.ctr);
          for(let i=0; i<data.length; i++){
            // this.createMarker2(data[i]);
            this.createMarker2(data[i]);
          }
      },
      (error : any) =>
      {
          console.dir(error);
      });
  }

  requestMarker(){
    
    this.dataRefresher = setInterval(() =>{
      if(this.loginService.logged_in_user_request_id!= null){
        this.status = true;
      }
      this.http.get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
      .subscribe((data : any) =>
      {
        console.log(data);
          this.request = data;
          if(this.ctr!=data.length){
            this.notification();
            console.log(this.ctr);
            console.log(data.length);
            for(let i=0; i<data.length; i++){
              // this.createMarker2(data[i]);
              this.createMarker2(data[i]);
          }
          this.ctr=data.length;
        }
      },
      (error : any) =>
      {
          console.dir(error);
      });
      // console.log(this.marker2);
    },1000);
  }

  notification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'NEW REPORTS!!',
      text: 'A request has been made',
      data: { mydata: 'My hidden message this is' },
      // trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      trigger:{at: new Date()},
      // foreground: true // Show the notification while app is open
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
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(lat), lng: parseFloat(long)},
      icon: data
    });
    // this.marker4.push(this.marker4);
    // return this.marker;
  }

yellow:any = 0;
  createMarker2(data:any){
    // createMarker2(data:any){
      // console.log("createmarker2");
  
      if(data.request_status_id==null){
        var lat = data.request_lat;
        var long = data.request_long;
        //  this.marker4 = new google.maps.Marker({
        const marker = new google.maps.Marker({
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          animation: google.maps.Animation.DROP,
          map: this.map,
          icon: this.purpleMarker   
        })
    
        // i show the alert on mark click yeeeeees <3
        let self = this
        // marker3[i].addListener('click', function() {
          marker.addListener('click', function() {
            // self.presentConfirm(data);
            if(self.loginService.logged_in_user_request_id == null || self.loginService.logged_in_stat_id == 3) {
              self.presentConfirm(data);
            } else {
              self.cantAlert();
            }
          });
  
      } else if(data.request_status_id==1 && data.request_id == this.user_request_id){
        this.rout(data);
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
        this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long);
      } else if (data.request_status_id == 0) {
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
              this.callForBackUpMarker(res, data);
              if (this.stat_id == 0 && this.loginService.logged_in_user_request_id == data.request_id) {
                this.rout(data);
              } else if(this.stat_id == 1) {
                this.rout(data);
                // this.trytry = this.LatLng1.distanceTo(leaflet.latLng(data.request_lat,data.request_long));
              } 
         }); 
      }

  }

  callForBackUpMarker(data:any, data1:any){

    var numberOfResponders = data.count;
    var iconnum = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue" + numberOfResponders + ".png"

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(data.request_lat), lng: parseFloat(data.request_long)},
      icon: iconnum
    });
    
    let self = this
        marker.addListener('click', function() {
          self.cfbRespond(data1)
        });     
  }

  cfbRespond(data) {
    let alert = this.alertCtrl.create({
      title: 'Response',
      message: 'Do you want to backup?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // this.change1();
          }
        },
        {
          text: 'See',
          handler: () => {
            console.log('Buy clicked');
            // clearInterval(this.dataRefresher);
            console.log('asdfasdf');
            this.navCtrl.push('RespondToRequestPage', {
              request_id : data.request_id,
              request_status_id : data.request_status_id, 
              person_to_check: data.person_to_check,
              event: data.event,
              persons_injured: data.persons_injured,
              persons_trapped: data.persons_trapped,
              other_info: data.other_info,
              special_needs: data.special_needs,
              request_lat: data.request_lat,
              request_long: data.request_long,

              option: "CFB"
            });
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
  rout(data){
    
    clearInterval(this.dataRefresher);
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
            console.log(this.directionsPanel.nativeElement);

            let x = document.getElementsByClassName('adp-summary');
            let y = document.getElementsByTagName('span')
            try {
              console.log(y[6].textContent);
              /******** UPDATE REQUEST STATUS ID **********/
              var headers = new Headers();
    
              headers.append("Accept", 'application/json');
              headers.append('Content-Type', 'application/x-www-form-urlencoded');
              headers.append('Access-Control-Allow-Origin' , '*');
              headers.append('Access-Control-Allow-Headers' , 'Content-Type');
              headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
              
              let options = new RequestOptions({ headers: headers });
              let data2 = {
                request_id: this.request_id,
                ETA: y[6].textContent
              }

              this.http2.post('http://usc-dcis.com/eligtas.app/update-request-ETA.php', data2, options)
              .map(res=> res.json())
              .subscribe((data2: any) =>
              {
                console.log(data2);
              },
              (error : any) =>
              {
                console.log(error);
                let alert2 = this.alertCtrl.create({
                  title:"FAILED",
                  subTitle: "Request not updated. huhu!",
                  buttons: ['OK']
                  });

                alert2.present();
              });
            } catch (error) {
              console.log(error);
            }

        } else {
            console.warn(status);
        }
      });
    });
    
  }
  
  presentConfirm(data) {
    let alert = this.alertCtrl.create({
      title: 'Response',
      message: 'Do you want to respond?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // this.change1();
            // this.navCtrl.push('RespondToRequestPage');
          }
        },
        {
          text: 'See',
          handler: () => {
            console.log('Buy clicked');
            // clearInterval(this.dataRefresher);
            // clearInterval(this.watchrefresher);
            console.log('asdfasdf');
            this.navCtrl.setRoot('RespondToRequestPage', {
              request_id : data.request_id,
              request_status_id : data.request_status_id, 
              person_to_check: data.person_to_check,
              event: data.event,
              persons_injured: data.persons_injured,
              persons_trapped: data.persons_trapped,
              other_info: data.other_info,
              special_needs: data.special_needs,
              request_lat: data.request_lat,
              request_long: data.request_long,
              
              option: "respond"
            });
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
    let alert = this.alertCtrl.create({
      message: "You cannot respond to this report.",
      buttons: ['OK']
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
  hospital: any = {
    url: "assets/imgs/user/hospital.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  hospital1: any = {
    url: "assets/imgs/user/hospital1.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  hospital2: any = {
    url: "assets/imgs/user/hospital2.png", // url
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
    }else if(data.hcf_type == 3){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png'
        icon: this.hospital
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

    this.stat_id = 1;

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
       console.log(data1);
       let alert = this.alertCtrl.create({
        message: "You have started navigating.",
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
    this.stat_id=2;
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
       // If the request was successful notify the user
       console.log(data);
       let alert = this.alertCtrl.create({
        message: "You have arrived!",
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
        subTitle: "Something went wrong!",
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
    this.requestMarker();
  }

  requestCallForBackUp(){
    //this.dataRefresher = setInterval(() =>{
      if(this.loginService.logged_in_user_request_id!= null){
        this.status = true;
      }
      var headers = new Headers();
      
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Headers' , 'Content-Type');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      
      let options = new RequestOptions({ headers: headers });

      let data = {
        request_id: this.request_id
      }

       this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-cfb-num.php',data,options)
       .map(res=> res.json())
         .subscribe(
           res => {
            this.callForBackUpMarker(res, data);
            console.log(res);
       }); 
       
    /******** UPDATE REQUEST STATUS ID **********/
    let data2 = {
      request_id: this.request_id,
      request_status_id: 0
    }

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
        subTitle: "Request not updated. huhu!",
        buttons: ['OK']
        });

      alert2.present();
    });
    
    /********** LOG **********/
    let data3 = {
      user_id: this.loginService.logged_in_user_id,
      action: "Callback",
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

    this.cfb = true;
  }

  pushDone() {
    this.responderongoing=0;
    this.stat_id=3;
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
        subTitle: "Request not updated. huhu!",
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
    } catch (error) {
      console.log(error)
    }
  }

  pushCancel() {
    // document.getElementById("hh").style.display = "none";
    console.log("clicked cancel");
    this.responderongoing=0;
    this.user_request_id = null;
    this.stat_id=0;
    
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
        subTitle: "Request not updated. huhu!",
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
      this.requestMarker();
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

}
