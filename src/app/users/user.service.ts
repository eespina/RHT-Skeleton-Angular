﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './user';
// import { Http } from '@angular/http'; //import { Http, Response } from '@angular/http'; (NOT using Response here, it's been moved to the AuthService)
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
// import 'rxjs/operator/map';
// import 'rxjs/operator/catch';
// import 'rxjs/observable/throw';
import { IAuthUser } from '../auth/authUser';
import 'rxjs';
import { catchError, tap } from 'rxjs/operators';
//import 'rxjs/add/Observable/of';    //perhaps ANOTHER way of doing a get from somewhere (probably from in-memory data)
//import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';   //TODO - figure out how to use ALL environments. WHY can't I use it in a generic manner now??

@Injectable()
export class UserService {
    constructor(private _http: HttpClient, private _router: Router, private _auth: AuthService) { }

    getUsers(): Observable<IUser[]> {
        //var users = this._http.get<IUser[]>('http://localhost:53465/api/user').delay(4130)    //can ALSO use this as an alternative (includes the '<IUser[]>' as the type returned from the observable)
        var users = this._http.get<IUser[]>(environment.baseUrl + 'user/')//.delay(4130)    //delay is just used to test the loading words and css animation
            //.map((response: Response) => <IUser[]>response.json())
            //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>. You no longer need to call the '.map' function above yourself.

            //UPDATED the older way to 'catch'... previously was "  .catch(error => this._auth.handleError(error));    ". NOT sure this applies for " .map" function, but seems to work
            .pipe(catchError(error => this._auth.handleError(error)));

        //perhaps ANOTHER way of facilitating a get from somewhere (implements "import 'rxjs/add/Observable/of'; " from above)
            //return Observable.of();   // I think this is more used for 'in-memory' type data, since the parameter in the example tutorial I'm using 

        return users;
    }

    getUserById(userUserName: string): Observable<IUser> {
        return this._http.get<IUser>(environment.baseUrl + 'user/' + userUserName)
        .pipe(catchError(error => this._auth.handleError(error)));
    }

    //this currently does nothing, it just returns mocked data back from the server
    updateUser(user: IAuthUser, password: string): Observable<IAuthUser> {
        console.log('inside updateUser()');
        console.log('inside updateUser(), user:' + JSON.stringify(user));
        console.log('inside updateUser(), password:' + password);
        if (password) {
            console.log('inside updateUser(). password is not null/undefined');
            this._auth.encryptUsingAES256(password, false);
            const httpOptions = {
                headers: new HttpHeaders(
                    {
                        'Content-Type': 'application/json',
                        'old-password': this._auth.encryptedPassword.toString(),
                        'new-password': this._auth.encryptedPassword.toString()
                    })
            };
            
            var updatedUser = this._http.put<IAuthUser>(environment.baseUrl + 'user/' + user.userName, user, httpOptions)
            .pipe(
                //TODO - use 'tap' if you ever wanna get response data. in this case, IUser is the equivelant to OwnerViewModel on the Server end
                tap((newUser: IAuthUser) => console.log(`added new user with userName = ${newUser.userName}`)),
                catchError(error => this._auth.handleError(error))
              );            

            console.log('LEAVING updateUser()');

            return updatedUser;

        } else {
            throwError('The Password\'s EMPTY')
        }
    }

    //handleError(error: Response) {
    //    //Change this to pass the exception to some logging service
    //    console.error(error.status + ' - ' + error.statusText);
    //    if (error && error.status == 401) {
    //        if (this._auth) {
    //            this._auth.logoutUser();
    //        }
    //    }
    //    return Observable.throw(error);
    //}

    ////Promise technique
    //getUserById(exId: string): Promise<IUser> {
    //    return this._http.get('http://localhost:42917/api/users/' + exId)
    //        .map((response: Response) => <IUser>response.json())
    //        .toPromise()
    //        .catch(this.handlePromiseError);
    //}

    ////Promise technique
    //handlePromiseError(error: Response) {
    //    //Change this to pass the exception to some logging service
    //    console.error(error);
    //    throw (error);
    //}
}