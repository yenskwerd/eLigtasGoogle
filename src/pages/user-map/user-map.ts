import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http'; 
import { UserHomePage } from '../user-home/user-home'; 
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';


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
  templateUrl: 'user-map.html',
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
  
  constructor(public http2: Http,public navCtrl: NavController, public alertCtrl : AlertController, public navParams: NavParams, public geolocation: Geolocation, 
    public loginService: LoginServiceProvider, public http : HttpClient, public modalCtrl: ModalController) {
    this.hcfMarkers = [];

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
    this.getUserRequest1();
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
          this.latitude = 10.355158;
          this.longitude = 123.9184494;
          // this.latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.latLng1 = new google.maps.LatLng(10.355158, 123.9184494);
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
            zoomControl: false,
            scaleControl: true
          };
          // this.addMarker();
         }, (err) => {
           console.log(err);
         
         });
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
 
  responseAlert(){
    this.dataRefresher = setInterval(() =>{
      console.log("nj gwapo");
      let alert = this.alertCtrl.create({
        title: 'Alert',
        message: 'Did anyone respond to your request?',
        buttons: [
          {
            text: 'Yes',
            role: 'cancel',
            handler: () => {
            this.check=1;
            console.log(this.check);
            this.looking = false;
            }
          },
          {
            text: 'No',
            handler: () => {
              console.log('Cancel clicked');
              // this.navCtrl.push('RespondToRequestPage'); 
            this.check=0;
            console.log(this.check);
            this.responseAlert();
            }
          }
        ]
      });
      if(this.check==0){
          clearInterval(this.dataRefresher);
          alert.present();
      } else {
          clearInterval(this.dataRefresher);
      } 
      
        },600000);
      // },5000);
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

  getUserRequest1(){
    //gets user data
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
    console.log(data);

   this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-user-request1.php',data,options)
   .map(res=> res.json())
     .subscribe(
       res => {
      // leaflet.marker([res.request_lat,res.request_long], {icon: this.grayIcon}).bindTooltip(res.event, {direction: 'bottom'}).addTo(this.map);
      // this.addMarker2(this.grayMarker, res.event);
      
      if (res.request_status_id == null) {
        this.looking = true;
        this.responseAlert();
      } else {
        this.looking = false;
      }
   }); 

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
            this.map.setZoom(14);
            this.HCFcolor = "assets/imgs/user/hcfa.png";
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
            this.map.setZoom(15);
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
            this.map.setZoom(14);
            
            this.emergencycolor = "assets/imgs/user/emergency2.png";
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
            this.map.setZoom(15);
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
       .get('http://usc-dcis.com/eligtas.app/retrieve-hcf.php')
       .subscribe((data : any) =>
       {
          console.log(data);
          this.request = data;
          if(this.evacshow == true){
            this.map.setZoom(14);
            this.evaccolor = "assets/imgs/user/evac.png";
            this.evacshow = false;
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
            this.map.setZoom(15);
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

  createMarker(data:any, i:any){

    if(data.hcf_type == 1){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png'
      });
    }else if(data.hcf_type == 3){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png'
      });
    }else if(data.hcf_type == 2){
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
      });
    }else{
      this.hcfMarkers[i] = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png'
      });
    }
  }
  /******** END SHOW MARKERS **********/

  /********** UNSHOW MARKERS ************/
  deleteMarker(i:any){
    this.hcfMarkers[i].setMap(null);
  }
  /******** END UNSHOW MARKERS **********/


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
  
}
