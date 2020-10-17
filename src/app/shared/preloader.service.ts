import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';

import { Observable } from 'rxjs';
// import 'rxjs/observable/of';
import 'rxjs';

@Injectable()
export class PreloaderService implements PreloadingStrategy {

    preload(route: Route, load: Function): Observable<any> {
        if (route.data && route.data['preload']) {
            return load();
        }
        // return Observable.of(null);  //ERRORS - 
    }
}
