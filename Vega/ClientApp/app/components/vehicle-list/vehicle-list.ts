import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

import { Vehicle, KeyValuePair } from './../../models/vehicle';
import { VehicleService } from './../../services/vehicle.service';

@Component({
  templateUrl: 'vehicle-list.html'
})
export class VehicleListComponent implements OnInit {
    private readonly PAGE_SIZE = 3;
    queryResult: any = {};
    makes: any[] = [];
    models: any[] = [];
    query: any = {
      pageSize: this.PAGE_SIZE
    };
    columns = [
      {title: 'Id'},
      {title: 'Make', key: 'make', isSortable: true},
      {title: 'Model', key: 'model', isSortable: true},
      {title: 'Contact Name', key: 'contactName', isSortable: true}
    ];
  
  constructor(private vehicleService: VehicleService, private auth: AuthService) { }

  ngOnInit() {  
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.populateVehicles();
  }

  private populateVehicles(){
    this.vehicleService.getVehicles(this.query)
      .subscribe(result => this.queryResult = result);
  }

  private populateModels(){
    var selectedMake = this.makes.find(m => m.id == this.query.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onMakeChange(){
    this.query.page = 1;
    this.populateModels();
    delete this.query.modelId;
    this.populateVehicles();
  }

  onModelChange(){
    this.query.page = 1;
    this.populateVehicles();
  }

  onNameChange(){
    this.query.page = 1;
    this.populateVehicles();
  }

  resetFilter(){
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    delete this.query.modelId;
    this.populateVehicles();
  }
 
  sortBy(columnName: any){
    if(this.query.sortBy === columnName){
      this.query.isSortAscending = !this.query.isSortAscending;
    }
    else{
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }

  onPageChange(page: any){
    this.query.page = page;
    this.populateVehicles();
  }
}