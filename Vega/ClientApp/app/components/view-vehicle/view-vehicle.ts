import { AuthService } from './../../services/auth.service';
import { BrowserXhr } from '@angular/http';
import { ToastyService } from 'ng2-toasty';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ElementRef } from '@angular/core/src/linker/element_ref';

import { VehicleService } from '../../services/vehicle.service';
import { SaveVehicle, Vehicle } from './../../models/vehicle';
import { PhotoService } from '../../services/photo.service';
import { ProgressService, BrowserXhrWithProgress } from '../../services/progress.service';

@Component({
  templateUrl: 'view-vehicle.html',
  providers: [
    { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    ProgressService
  ]
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  vehicle: any ;
  vehicleId: number;
  photos: any[];
  progress: any[];

  constructor(
    private auth: AuthService,
    private zone: NgZone,
    private route: ActivatedRoute, 
    private router: Router,
    private toastyService: ToastyService,
    private photoService: PhotoService,
    private progressService: ProgressService,
    private vehicleService: VehicleService) { 

    route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);
      
    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(v => {
          this.vehicle = v;
          console.log(this.vehicle);
        },
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return; 
          }
        });
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.deleteVehicle(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles']);
        });
    }
  }

  uploadPhoto(){
    this.progressService.startTracking ()
      .subscribe(progress => {
        console.log(progress);
        this.zone.run(() => {
          this.progress = progress;
        });
      },
      null,
      () => this.progress = null);

    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file = nativeElement.files[0];
    nativeElement.value = '';
    
    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => {
        this.photos.push(photo);
      },
      err => {
        this.toastyService.error({
          title: 'Error',
          msg: err.text(),
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
      });
      }
    );
  }
}