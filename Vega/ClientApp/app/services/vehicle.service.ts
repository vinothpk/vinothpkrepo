import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { SaveVehicle } from '../models/vehicle';

@Injectable()
export class VehicleService {
  private readonly vehiclesEndpoint = '/api/vehicles';

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getMakes(){
    return this.http.get('/api/makes')
      .map(res => res.json());
  }

  getFeatures(){
    return this.http.get('/api/features')
      .map(res => res.json());
  }

  getVehicle(id: any){
    return this.http.get(this.vehiclesEndpoint + '/' + id)
      .map(res => res.json());
  }

  createVehicle(vehicle: SaveVehicle){
    return this.authHttp.post(this.vehiclesEndpoint, vehicle)
      .map(res => res.json());
  }

  updateVehicle(vehicle: SaveVehicle){
    return this.authHttp.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle)
      .map(res => res.json());
  }

  deleteVehicle(id: any){
    return this.authHttp.delete(this.vehiclesEndpoint + '/' + id)
      .map(res => res.json());
  }

  getVehicles(filter: any) {
    return this.http.get(this.vehiclesEndpoint + '?' + this.toQueryString(filter))
      .map(res => res.json());
  }

  toQueryString(obj: any) {
    var parts = [];
    for(var property in obj){
      var value = obj[property];
      if(value != null && value != undefined)
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }
    return parts.join('&');
  }

  getMakesCount() {
    return this.http.get('/api/admin/makescount')
      .map(res => res.json());
  }

  getModelsCount() {
    return this.http.get('/api/admin/modelscount')
      .map(res => res.json());
  }

}
