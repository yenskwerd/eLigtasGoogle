import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http'; 
import { UserHomePage } from '../user-home/user-home'; 
import { Http } from '@angular/http';

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
  
  constructor(public http2: Http,public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, 
    public http : HttpClient, public modalCtrl: ModalController) {
    this.hcfMarkers = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserMapPage');
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

  loadmap(){
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
            // this.map.locate({
            //   setView: true,
            //   maxZoom: 18
            // });
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
            
            this.emergencycolor = "assets/imgs/user/emergency2.png";
            this.emergencyshow = false;
            for(let i=0; i<data.length; i++){
              if(data[i].status==1) {
                this.hcfMarkers[i] = new google.maps.Marker({
                  map: this.map,
                  animation: google.maps.Animation.DROP,
                  position: {lat: parseFloat(data.xloc), lng: parseFloat(data.yloc)},
                  icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png'
                });
              }
            }
            console.log("true");
          }else{
            // this.map.locate({
            //   setView: true,
            //   maxZoom: 18
            // });
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
  }
  
}
