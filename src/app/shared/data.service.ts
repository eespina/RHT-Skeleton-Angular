import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

//for things that need a service of global attention... use this. for smaller things, use EventEmitter, etc..
@Injectable()
export class DataService {
    private messageSource = new BehaviorSubject<string>("Log In");
    currentMessage = this.messageSource.asObservable();
    
    constructor() { }

    changeLogInOrOutStatus(message: string) {
        this.messageSource.next(message);
        console.log('Message changed to ' + message);
    }
}