import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

/**
 * Generated class for the RespMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-resp-map',
  templateUrl: 'resp-map.html',
})
export class RespMapPage {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  
  requestMarkers: any;
  redMarker: any;
  purpleMarker: any;
  yellowMarker: any;
  grayMarker: any;
  blackMarker: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public http2 : Http, public http : HttpClient, public navParams: NavParams,
    public loginService: LoginServiceProvider, public alertCtrl : AlertController) {
    this.hcfMarkers = [];
    this.requestMarkers = [];

    this.redMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
    this.purpleMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png";
    this.yellowMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
    this.grayMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
    this.blackMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RespMapPage');
    this.loadmap();
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
  
  user_request_id: any;
  stat_id: any;

  loadmap(){

    this.http.get('http://usc-dcis.com/eligtas.app/retrieve-user-request.php')
      .subscribe((res : any) =>
      {
        console.log(res.request_id);
        this.user_request_id = res.request_id;
        console.log(res.stat_id);
        this.stat_id = res.stat_id;
        
        this.geolocation.getCurrentPosition().then((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
            let mapOptions = {
              center: this.latLng1,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
      
            this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions), {
              // disableDefaultUI: true,
              fullscreenControl: true,
              zoomControl: false,
              scaleControl: true
            };
            this.addMarker(this.redMarker);
          }, (err) => {
            console.log(err);
          
        });
  
        this.requestMarker();
        
    }); 
  }

  addMarker(data){
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
     this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
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

  requestMarker(){
    // this.dataRefresher = setInterval(() =>{
      if(this.loginService.logged_in_user_request_id!= null){
        this.status = true;
      }
      this.http.get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
      .subscribe((data : any) =>
      {
        console.log(data);
          this.request = data;
          // this.markerGroup.clearLayers();
          for(let i=0; i<data.length; i++){
            this.createMarker2(data[i]);
          }
      },
      (error : any) =>
      {
          console.dir(error);
      });
    // },1000);
  }
  
  
  marker2: any;
  
  addMarker2(data, lat, long){
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
     this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(lat), lng: parseFloat(long)},
      icon: data
    });
  }

  testfunction(data){
      console.log(data);
  }
   
  createMarker2(data:any){
    // console.log("createmarker2");

    if(data.request_status_id==null){
      var lat = data.request_lat;
      var long = data.request_long;

      const marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(long) },
        map: this.map,
        icon: this.purpleMarker   
        })
  
      // i show the alert on mark click yeeeeees <3
      let self = this
        marker.addListener('click', function() {
          console.log("test");
          self.presentConfirm(data);
        });
      

    } else if(data.request_status_id==1 && data.request_id == this.user_request_id){
      // this.trylat = data.request_lat;
      // this.trylong = data.request_long;
      // console.log(this.trylat, this.trylong);
      // this.rout(data);
      // this.eventForReport = data.event;
      // this.request_id = data.request_id;
      this.marker2 = this.addMarker2(this.yellowMarker, data.request_lat, data.request_long);

    } else if( data.request_status_id==2 ){
      // this.eventForReport = data.event;
      this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long);
    } else if (data.request_status_id == 0) {
      // var headers = new Headers();
      
      // headers.append("Accept", 'application/json');
      // headers.append('Content-Type', 'application/x-www-form-urlencoded');
      // headers.append('Access-Control-Allow-Origin' , '*');
      // headers.append('Access-Control-Allow-Headers' , 'Content-Type');
      // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      
      // let options = new RequestOptions({ headers: headers });

      // let data1 = {
      //   request_id: data.request_id
      // }

      //  this.http2.post('http://usc-dcis.com/eligtas.app/retrieve-cfb-num.php',data1,options)
      //  .map(res=> res.json())
      //    .subscribe(
      //      res => {
      //       this.callForBackUpMarker(res, data);
      //       if (this.stat_id == 0 && this.loginService.logged_in_user_request_id == data.request_id) {
      //         this.rout(data);
      //       } else if(this.stat_id == 1) {
      //         this.rout(data);
      //         this.trytry = this.LatLng1.distanceTo(leaflet.latLng(data.request_lat,data.request_long));
      //       } 
      //  }); 
    }

    // var circle = leaflet.circle([data.request_lat, data.request_long], {
    //   color: "rgba(255,255,255,0)",
    //       fillColor: '#81C784',
    //     fillOpacity: 0,
    //     radius: 100
    // }).addTo(this.map);
    // this.map.removeLayer(this.markerGroup);
    // this.markerGroup.addLayer(this.marker2);
    // this.map.addLayer(this.markerGroup);
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

  /********* Emergency and HCF buttons *********/
  HCFshow: any = true;
  emergencyshow: any = true;
  HCFcolor: any = "assets/imgs/user/hcfi.png";
  emergencycolor: any = "assets/imgs/user/emergency.png";

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

  
  /********** RECENTER ************/
  recenter() {
    this.map.setCenter(this.latLng1);
    this.map.setZoom(15);
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

}
