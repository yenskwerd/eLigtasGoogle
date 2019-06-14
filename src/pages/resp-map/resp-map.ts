import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import 'rxjs/add/operator/map';
import { analyzeAndValidateNgModules } from '@angular/compiler';


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
  dataRefresher: any;
  requestMarkers: any;
  requestmarkers:any;
  redMarker: any;
  purpleMarker: any;
  yellowMarker: any;
  grayMarker: any;
  blackMarker: any; 

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

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public geolocation: Geolocation, public http2 : Http, public http : HttpClient, public navParams: NavParams,
    public loginService: LoginServiceProvider, public alertCtrl : AlertController) {
    this.hcfMarkers = [];
    this.requestMarkers = [];

    this.redMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
    this.purpleMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png";
    this.yellowMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
    this.grayMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
    this.blackMarker = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png";
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad RespMapPage');
  //   this.loadmap();
  //   // window.location.reload();
  // //   google.maps.event.trigger(window, 'resize', function() {
  // //     // var lastCenter = this.map.getCenter();
  // //     google.maps.event.trigger(this.map, 'resize');
  // //     // this.map.setCenter(lastCenter);
  // // });
  //   // google.maps.event.trigger(this.map, 'resize');
  // }

  // ionViewWillEnter() {
  //   this.loadmap();
    
  //   // google.maps.event.trigger(this.map, 'resize');
  // }

  ionViewDidEnter(){
    this.loadmap();
    console.log(this.datetoday);
      console.log(this.myDate);
      console.log(this.h)
    // window.location.reload();
    // google.maps.event.trigger(this.map, 'resize');
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
            
            this.geolocation.getCurrentPosition().then((position) => {
                this.latitude = 10.355158;
                this.longitude = 123.9184494;
                // this.latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.latLng1 = new google.maps.LatLng(10.355158, 123.9184494);
                let mapOptions = {
                  center: this.latLng1,
                  zoom: 14,
                  disableDefaultUI: true,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                // 10.3813503, 123.9815693
                this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions), {
                  disableDefaultUI: true,
                  fullscreenControl: true,
                  zoomControl: false,
                  scaleControl: true
                };
                // google.maps.event.trigger(this.map,'resize');
                this.addMarker(this.redMarker);
              }, (err) => {
                console.log(err);
              
            });
      
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
          // this.markerGroup.clearLayers();
          for(let i=0; i<data.length; i++){
            // this.createMarker2(data[i]);
            this.createMarker2(data[i]);
          }
      },
      (error : any) =>
      {
          console.dir(error);
      });
      console.log(this.marker2);
    },5000);
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

  // deleteMarker2(){
  //   this.marker3.setMap(null);
  // }
// marker3: any[];
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
        this.eventForReport = data.event;
        // this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long,i);
        this.marker2 = this.addMarker2(this.grayMarker, data.request_lat, data.request_long);
      } else if (data.request_status_id == 0) {
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
      message: 'Do you want really want to cancel request? Are you sure? Last najud?',
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

  rout(data){
    
    // clearInterval(this.dataRefresher);
    // this.markerGroup2.clearLayers();

    this.mapClass = "mapDirClass";
    // this.marker.setMap(null);
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data2) => {
        // this.marker.setMap(null);
      this.directionsDisplay.setMap(this.map);  
      // this.directionsDisplay.setOptions({suppressMarkers:true});
      this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      
      this.directionsService.route({
          // origin: {lat: position.coords.latitude, lng: position.coords.longitude},
        destination: {lat: data.request_lat, lng: data.request_long},
        origin: {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)},
        // origin: {lat: data2.coords.latitude, lng: data2.coords.longitude},
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
            this.map.setZoom(12);
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
            this.map.setZoom(12);
            
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
          if(this.evacshow == true){
            this.map.setZoom(12);
            
            this.evaccolor = "assets/imgs/user/evac.png";
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

    let content = data.name;
    this.addInfoWindow(this.hcfMarkers[i], content);
  }
  /******** END SHOW MARKERS **********/

  /********** UNSHOW MARKERS ************/
  deleteMarker(i:any){
    this.hcfMarkers[i].setMap(null);
  }
  /******** END UNSHOW MARKERS **********/

  
  /******** BUTTON FUNCTIONS **********/
  start(data:any){

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
    .subscribe((data2: any) =>
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
    .subscribe((data2: any) =>
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
    .subscribe((data2: any) =>
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

  pushCancel() {
    console.log("clicked cancel");
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
    .subscribe((data2: any) =>
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
    .subscribe((data5: any) =>
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
    
    /////try og delete sa requested markers
// if(this.loginService.logged_in_user_request_id!= null){
//   this.status = true;
// }
// this.http.get('http://usc-dcis.com/eligtas.app/retrieve-request.php')
// .subscribe((data : any) =>
// {
//   console.log(data);
//     this.request = data;
    
//     for(let i=0; i<data.length; i++){
//       this.marker4.setMap(null);
//     }
// },
// (error : any) =>
// {
//     console.dir(error);
// });
    // this.marker4.setMap(null);
    // this.marker.setMap(null);
    // this.marker2.setMap(null)
    // this.deleteyellow();
    // this.requestMarkers.remove();
    // if (this.requestmarkers && this.requestmarkers.setMap) {
    //   this.requestmarkers.setMap(null);
    // }
    // this.marker4.setMap(null);
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
    this.directionsDisplay.setOptions({suppressMarkers:true});
    this.directionsDisplay.setOptions({suppressPolylines:true});
    // this.directionsDisplay.setDirections(null);
    this.directionsDisplay.set('directionsPanel', null);
    // this.directionsDisplay.setMap(null);
    // this.directionsDisplay.setPanel(null);
    // this.requestMarker();
    // this.directionsDisplay.setMap(null);  
    // this.directionsDisplay.setPanel(null);
    // this.map.removeControl(this.control);
    // this.addMarker(this.redMarker);
    // this.marker.setMap(null);
    // this.directionsDisplay.setMap(null);
    // this.directionsDisplay.setPanel(null);
    // this.marker2.setMap(null);
    // this.requestMarker();
    // this.directionsDisplay.setMap(null);
    // this.directionsDisplay.setPanel(null);
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

  // deletemarker3(data:any, i:any){
  //   // createMarker2(data:any){
  //     // console.log("createmarker2");
  
  //     if(data.request_status_id==null){
  //       var lat = data.request_lat;
  //       var long = data.request_long;
  //       //  this.marker3 = new google.maps.Marker({
  //       const marker4 = new google.maps.Marker({
  //         position: { lat: parseFloat(lat), lng: parseFloat(long) },
  //         animation: google.maps.Animation.DROP,
  //         map: this.map,
  //         icon: this.purpleMarker   
  //       })
  //         this
  //           marker4.setMap(null);
  //       }
  //     }

  //remove requested markes
  // createMarker3(data:any){
  //   // console.log("createmarker2");

  //   if(data.request_status_id==null){
  //     var lat = data.request_lat;
  //     var long = data.request_long;

  //     const marker = new google.maps.Marker({
  //       position: { lat: parseFloat(lat), lng: parseFloat(long) },
  //       animation: google.maps.Animation.DROP,
  //       map: this.map,
  //       icon: this.purpleMarker   
  //     })
  
  //     // i show the alert on mark click yeeeeees <3
  //     let self = this
  //       marker.addListener('click', function() {
  //         // self.presentConfirm(data);
  //         if(self.loginService.logged_in_user_request_id == null || self.loginService.logged_in_stat_id == 3) {
  //           self.presentConfirm(data);
  //         } else {
  //           self.cantAlert();
  //         }
  //       });

  //   } else if(data.request_status_id==1 && data.request_id == this.user_request_id){
  //     this.rout(data);
  //     this.eventForReport = data.event;
  //     this.request_id = data.request_id;
  //     this.marker2 = this.addMarker3(this.yellowMarker, data.request_lat, data.request_long);

  //   } else if( data.request_status_id==2 ){
  //     this.eventForReport = data.event;
  //     this.marker2 = this.addMarker3(this.grayMarker, data.request_lat, data.request_long);
  //   } 
  //     this.marker.setMap(null);
  //     // this.marker2.setMap(null);
  // }
  // addMarker3(data, lat, long){
  //   // this.directionsDisplay.setMap(null);
  //   // this.directionsDisplay.setPanel(null);
  //    this.marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: {lat: parseFloat(lat), lng: parseFloat(long)},
  //     icon: data
  //   });
  // }
}
