import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingService implements PreloadingStrategy {

  constructor() { }

  //route provides access to the current route. fn is a function that preloads a given module
  preload(route: Route, fn: () => Observable<any>): Observable<any> {

   //check if the given route has the data property from the app-routing module, AND that the property is true
   if(route.data && route.data['preload']){
     return fn(); //then return this function, which preloads the module
   } else{
     return of(null); //we want to return an observable of null to indicate that we do NOT want the module to be preloaded
   }

    //throw new Error('Method not implemented.');
  }
}
