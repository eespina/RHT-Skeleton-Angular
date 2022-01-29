import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

//for things that need a service of global attention... use this. for smaller things, use EventEmitter, etc..
@Injectable()
export class AuthBehaviorService {
    private messageSource = new BehaviorSubject<string>("Log In");
    public isLoggedInSource = new BehaviorSubject<boolean>(false);
    currentMessage = this.messageSource.asObservable();
    loggedInStatus = this.isLoggedInSource.asObservable();
    
    constructor() { }

    changeLoggedInStatus(isLoggedIn: boolean){
        this.isLoggedInSource.next(isLoggedIn);
        //console.log('loggedInStatus changed to ' + isLoggedIn);        
    }

    changeLogInOrOutStatus(message: string) {
        this.messageSource.next(message);
        //console.log('Message changed to ' + message);
    }
}