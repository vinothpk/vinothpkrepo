import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { VehicleService } from '../../services/vehicle.service';
import { MakesCountResource, ModelsCountResource } from '../../models/vehicle';

@Component({
    template: `<h1>Admin</h1>
    <chart type="pie" [data]="makesData"></chart>
    <chart type="pie" [data]="modelsData"></chart>
    `
})
export class AdminComponent {
    makesData: any;
    modelsData: any;

    constructor(private vehicleService: VehicleService, private router: Router) { }

    ngOnInit() {
        var sources = [
            this.vehicleService.getMakesCount(),
            this.vehicleService.getModelsCount()
        ];

        Observable.forkJoin(sources).subscribe(data => {
            var makesCount = data[0];
            var modelsCount = data[1];

            makesCount.makeName = data[0].map(a => a.makeName);
            makesCount.makeCount = data[0].map(a => a.makeCount);
            console.log("Makes Count:", makesCount);

            modelsCount.modelName = data[1].map(a => a.modelName);
            modelsCount.modelCount = data[1].map(a => a.modelCount);
            console.log("Models Count:", modelsCount);

            var makesColor = [];
            var modelsColor = [];

            for(let i = 0; i < makesCount.length; i++)
            {
                makesColor.push("rgb("+ Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
            }
            for(let i = 0; i < modelsCount.length; i++)
            {
                modelsColor.push("rgb("+ Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
            }

            this.makesData = {
                labels: makesCount.makeName,
                datasets: [{
                        data: makesCount.makeCount,
                        backgroundColor: makesColor /*backgroundColor: ["#ff6384","#36a2eb","#ffce56"]*/
                }]
            };

            this.modelsData = {
                labels: modelsCount.modelName,
                datasets: [{
                        data: modelsCount.modelCount,
                        backgroundColor: modelsColor
                }]
            };

        },
        err => {
            if(err.status == 404)
                this.router.navigate(['/home']);
        });
    }
}
