import { Injectable } from '@angular/core';
import { Http, BrowserXhr } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProgressService {
    private uploadProgress: Subject<any>;
    
    startTracking(){
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress){
        if(this.uploadProgress)
            this.uploadProgress.next(progress);
    }

    endTracking(){
        if(this.uploadProgress)
            this.uploadProgress.complete();
    }
}

@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr {
    
    constructor(private progressService: ProgressService) {super()}

    build(): XMLHttpRequest {
        var xhr: XMLHttpRequest = super.build();

        xhr.upload.onprogress = (event) => {
            this.progressService.notify(this.createProgress(event));
        };

        xhr.upload.onloadend = () => {
            //console.log("Before", this.progressService.uploadProgress);
            this.progressService.endTracking();
            //console.log("After", this.progressService.uploadProgress);
        }

        return xhr;
    }

    private createProgress(event) {
        return {
            total: event.total,
            percentage: Math.round(event.loaded / event.total * 100)
        }
    }
}

