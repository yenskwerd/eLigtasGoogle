import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {
  public loginState: any; //1 if user 2 if responder
  public logged_in_user_id:any;
  public logged_in_user_request_id:any;
  public logged_in_user_name:any;
  public logged_in_user_password:any;
  public logged_in_stat_id:any;
  public logged_in_request: any;
  public lastlat: any;
  public lastlong: any;

  constructor(public http: HttpClient) {
    console.log('Hello LoginServiceProvider Provider');
  }

}
