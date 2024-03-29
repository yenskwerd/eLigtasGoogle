import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http'; 
import { UserHomePage } from '../user-home/user-home'; 
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { escapeRegExp } from '@angular/compiler/src/util';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the UserMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-user-map',
  templateUrl: 'user-map.html'
})
export class UserMapPage {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  
  requestMarkers: any;
  redMarker: any;
  purpleMarker: any;
  yellowMarker: any;
  grayMarker: any;
  blackMarker: any; 
  blueMarker: any;

  looking: any=false;
  ETA: any;
  
  constructor(public http2: Http,
      public navCtrl: NavController, 
      public alertCtrl : AlertController, 
      public navParams: NavParams, 
      public geolocation: Geolocation, 
      public loginService: LoginServiceProvider, 
      public http : HttpClient, 
      public modalCtrl: ModalController,
      public plt: Platform,
      public localNotifications: LocalNotifications,
      public translate: TranslateService) {
        
    this.hcfMarkers = [];
    this.distanceArr = [];

    this.redMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
    this.purpleMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png";
    this.yellowMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
    this.grayMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
    this.blackMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png";
    this.blueMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png";
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad UserMapPage');
  //   console.log(new Date());
  //   this.loadmap();
  // }
  
  ionViewWillEnter() {
    this.loadmap();
    // this.getUserRequest1();
  }

  /********** Google Maps **********/
  
  map: any;
  latLng1: any;
  marker:any;
  longitude: any;
  latitude: any;
  mapClass: string = "mapClass";
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({ preserveViewport: true });


  loadmap(){
        this.geolocation.getCurrentPosition().then((position) => {
    //       let watch = this.geolocation.watchPosition();
    // watch.subscribe((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          // this.latLng1 = new google.maps.LatLng(10.355158, 123.9184494);
          // 10.355158, 123.9184494
          let mapOptions = {
            center: this.latLng1,
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
     
          this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions), {
            // disableDefaultUI: true,
            fullscreenControl: true,
            streetViewControl: true,
            zoomControl: false,
            scaleControl: true,
            clickableIcons: false
          };
          // this.addMarker();
         }, (err) => {
           console.log(err);
         
         });
         this.getUserRequest1();
  }

  addMarker(){
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
     this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
      icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
    });
   
   
    let content = "<h4>You are here!</h4>";
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

  /********* Response Check Alert ********/
  
  dataRefresher:any;
  check:any =0;
 
  // responseAlert(){
  //   this.dataRefresher = setInterval(() =>{
  //     let alert = this.alertCtrl.create({
  //       title: 'Alert',
  //       message: 'Did anyone respond to your request?',
  //       buttons: [
  //         {
  //           text: 'Yes',
  //           role: 'cancel',
  //           handler: () => {
  //           this.looking = false;
  //           clearInterval(this.dataRefresher);
  //           }
  //         },
  //         {
  //           text: 'No',
  //           handler: () => {
  //           this.temp = null;
  //           }
  //         }
  //       ]
  //     });
  //     clearInterval(this.dataRefresher);
  //     alert.present();
      
      
  //   },600000);
  // }

  ionViewWillLeave() {
    console.log("leave");
    clearInterval(this.dataRefresher);
  }

  /********* Existing Report Markers ********/

  addMarker2(data,content,latuser,longuser){
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
     this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(latuser), lng: parseFloat(longuser)},
      icon: data
    });
   
   
    // let content = "<h6>You are here!</h6>";
    this.addInfoWindow(this.marker, content);
  }

  dataRefresher1: any;
  temp: any;
  ctr: any;

  getUserRequest1(){
    //gets user data
    console.log("DARA");
    var headers = new Headers();
    this.ctr = 0;
  
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Headers' , 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    
    let options = new RequestOptions({ headers: headers });

    let data = {
      request_id: this.loginService.logged_in_user_request_id
    }

    let dataUser = {
      username: this.loginService.logged_in_user_name,
      password: this.loginService.logged_in_user_password,
    }

    this.dataRefresher1 = setInterval(() => {
      if(this.ctr == 0){
        this.http2.post('http://usc-dcis.com/eligtas.app/login.php',dataUser,options)
        .map(res=> res.json()) 
        .subscribe(
        res => {
          let dataReq = {
            request_id: res.request_id
          }

          console.log(dataReq);

          if(dataReq.request_id != null){
            this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-user-request1.php',dataReq,options)
            .map(res=> res.json()) 
            .subscribe(
            res => {
            // leaflet.marker([res.request_lat,res.request_long], {icon: this.grayIcon}).bindTooltip(res.event, {direction: 'bottom'}).addTo(this.map);
            // this.addMarker2(this.grayMarker, res.event);
          
              this.ETA = res.ETA;

              if (res.request_status_id == null) {
                console.log("NULL");
                if(this.temp == null){
                  this.temp = 1;
                  this.looking = true;
                  // ∂this.responseAlert();
                }
                
              } else if (res.request_status_id == 1){
                this.ctr = 1;
                console.log("1");
                console.log(this.ETA);
                clearInterval(this.dataRefresher1);
                this.temp = 1;

                let title, res1, res2;
                this.translate.get('Responder').subscribe(
                  value => {
                    // value is our translated string
                    title = value;
                });
                this.translate.get('responder1').subscribe(
                  value => {
                    // value is our translated string
                    res1 = value;
                });
                this.translate.get('responder2').subscribe(
                  value => {
                    // value is our translated string
                    res2 = value;
                });
                console.log("A responder is on his way :"+this.ETA);
                this.localNotifications.schedule({
                  id: 1,
                  title: title,
                  text: res1+this.ETA+res2,
                  data: { mydata: 'My hidden message this is' },
                  trigger:{at: new Date()},
                });
              }
            });
          }    
        }); 
      }

      
    }, 5000);

   let data2 = {
      user_id: this.loginService.logged_in_user_id
    }

     this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-history.php',data2,options) 
    .map(res=> res.json())
    .subscribe((data: any) =>
    {
      console.log(data);
      for(let i=0; i<data.length; i++){
        if(data[i].request_status_id==null) {
          if (data[i].event == "Fire") {
            // this.addMarker2(this.redMarker, data[i].event);
            this.addMarker2(this.redMarker,data[i].event, data[i].request_lat,data[i].request_long);
            // leaflet.marker([data[i].request_lat,data[i].request_long], {icon: this.redIcon}).bindTooltip(data[i].event, {direction: 'bottom'}).addTo(this.map);
          } else if (data[i].event == "Earthquake") {
            // this.addMarker2(this.yellowMarker, data[i].event);
            this.addMarker2(this.redMarker, data[i].event,data[i].request_lat,data[i].request_long);
            // leaflet.marker([data[i].request_lat,data[i].request_long], {icon: this.orangeIcon}).bindTooltip(data[i].event, {direction: 'bottom'}).addTo(this.map);
          } else if (data[i].event == "Flood") {
            // this.addMarker2(this.blueMarker, data[i].event);
            this.addMarker2(this.redMarker, data[i].event,data[i].request_lat,data[i].request_long);
            // leaflet.marker([data[i].request_lat,data[i].request_long], {icon: this.blackIcon}).bindTooltip(data[i].event, {direction: 'bottom'}).addTo(this.map);
          } 
        }        
      }
    },
    (error : any) =>
    {
      console.dir(error);
    }); 
   
  }

  /********* Emergency and HCF buttons *********/
  HCFshow: any = true;
  emergencyshow: any = true;
  evacshow: any = true;
  HCFcolor: any = "assets/imgs/user/hcfi.png";
  emergencycolor: any = "assets/imgs/user/emergency.png";
  evaccolor: any = "assets/imgs/user/evac1.png";

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

            // this.minimum = this.distanceArr[0].distance;
            // this.index = 0;
            
            // for(let i=1; i<this.distanceArr.length; i++){
            //   if(this.distanceArr[i].distance<this.minimum){
            //     this.minimum = this.distanceArr[i].distance;
            //     this.index = i;
            //   }
            // }
            // this.route(this.distanceArr[this.index]);
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
    // this.map.locate({
    //   setView: true,
    //   maxZoom: 13
    // });
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
    // this.dataRefresher = setInterval(() =>{
    this.http
       .get('http://usc-dcis.com/eligtas.app/retrieve-evac.php')
       .subscribe((data : any) =>
       {
          console.log(data);
          this.request = data;
          if(this.evacshow == true){
            this.map.setZoom(12);
            this.evaccolor = "assets/imgs/user/evac.png";
            this.HCFcolor = "assets/imgs/user/hcfi.png";
            this.emergencycolor = "assets/imgs/user/emergency.png";
            this.evacshow = false;
            if(this.hcfMarkers.length!=0) {
              for(let i=0; i<this.hcfMarkers.length; i++){
                this.deleteMarker(i);
              }
            }
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

            // this.minimum = this.distanceArr[0].distance;
            // this.index = 0;
            
            // for(let i=1; i<this.distanceArr.length; i++){
            //   if(this.distanceArr[i].distance<this.minimum){
            //     this.minimum = this.distanceArr[i].distance;
            //     this.index = i;
            //   }
            // }
            // this.route(this.distanceArr[this.index]);
            console.log("true");
          }else{
            this.directionsDisplay.setMap(null);
            this.directionsDisplay.setPanel(null);
            this.mapClass = "mapClass";
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
      // },1000);
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
  rhu: any = {
    url: "assets/imgs/user/health.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  evacuation: any = {
    url: "assets/imgs/user/pav1.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  firestation: any = {
    url: "assets/imgs/user/fstn.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor 
  };
  sports: any = {
    url: "assets/imgs/user/gym.png", // url
    scaledSize: new google.maps.Size(30, 30), // size
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
        // icon: 'assets/imgs/user/emergencymarker.png'
        icon: this.hospital1
      });
    }else if(data.hcf_type == 3){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        // icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png'
        // icon: 'assets/imgs/user/hcfmarker.png'
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

  /******** SHOW MODAL **********/
  passPage: any;

  showModal() {
    var modal = this.modalCtrl.create(UserHomePage, {
      lat: this.map.getCenter().lat().toString(),
      long: this.map.getCenter().lng().toString()
    });
    modal.present();
    console.log(this.map.getCenter().lng().toString());
    
    modal.onDidDismiss((result) =>{
      if(result){
        console.log(result);
        this.passPage = result;
      }
    });
  }
  
  /******** MAKE REPORT ********/
  PushPage(){
    this.navCtrl.setRoot(this.passPage, {
      lat: this.map.getCenter().lat().toString(),
      long: this.map.getCenter().lng().toString()
    });
    // this.getUserRequest1();
  }

  
  /********** RECENTER ************/
  recenter() {
    this.map.setCenter(this.latLng1);
  }

  lat:any;
  long:any;
  marker3:any;
  addMarker3(){
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
     this.marker3 = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(this.lat), lng: parseFloat(this.long)},
      icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
    });
  }

  showlastlocation(){
    this.lat=this.loginService.lastlat;
    this.long=this.loginService.lastlong;
    if(this.evacshow == true){
      // this.evaccolor = "assets/imgs/user/evac.png";
      this.evacshow = false;
      this.addMarker3();
    }else{
      // this.evaccolor = "assets/imgs/user/evac1.png";
      this.evacshow = true;
      console.log("false");
      this.marker3=null;
    }
  }

  showreportedevents($event){

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
