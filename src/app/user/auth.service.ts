import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { IUser } from './user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';   //HttpErrorResponse is not being used. Instead, we're using the 'Response' imported library
//import { Response } from '@angular/http';   //Http, 
import { Observable, throwError } from 'rxjs';
// import 'rxjs/operator/map';
// import 'rxjs/operator/catch';
// import 'rxjs/Observable/throw';
import 'rxjs';
import { catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
//import { MessageService } from '../messages/message.service'; //Implement this for ANY service that requires messaging (OR LOGGING)
import { environment } from '../../environments/environment';   //TODO - figure out how to use ALL environments. WHY can't I use it in a generic manner now??

@Injectable()
export class AuthService {
    private _registerUrl = environment.registerUrl;
    private _loginUrl = environment.loginUrl;
    private _logoutUrl = environment.logoutUrl;
    private key = CryptoJS.enc.Utf8.parse(environment.cryptoKey);
    private iv = CryptoJS.enc.Utf8.parse(environment.cryptoKey);

    encryptedUsername: string;
    encryptedPassword: string;
    redirectUrl: string;
    loggedInUser: IUser;
    isSessionLoggedIn: boolean;

    constructor(private _http: HttpClient, private _router: Router) {   //, private messageService: MessageService)
        this.isSessionLoggedIn = false;
    }

    registerUser(registeringUser): Observable<IUser> {
        let registrationResponse = this._http.post<IUser>(this._registerUrl, registeringUser)
            //.map((response: Response) => <IUser>response.json())  //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>.
            //You no longer need to call the '.map' function above yourself.
            .pipe(catchError(error => this.handleError(error)));  //UPDATED the older way to 'catch'... previously was "  .catch(error => this.handleError(error));
        this.loggedInUser = registeringUser;
        return registrationResponse;
    }

    loginUser(loginUser): Observable<IUser> {
        // console.log('inside "loginUser" with key: ' + environment.cryptoKey);

        this.encryptUsingAES256(loginUser.userName, true);
        this.encryptUsingAES256(loginUser.password, false);
        // let sendingUser = { userName: loginUser.userName, password: loginUser.password } as ILoginInfo;

        let headers = new HttpHeaders();
        headers = headers.append('username', this.encryptedUsername.toString());
        headers = headers.append('password', this.encryptedPassword.toString());

        let loginResponse = this._http.post<IUser>(this._loginUrl, null, {headers})
            //.map((response: Response) => <IUser>response.json())  //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>.
            //You no longer need to call the '.map' function above yourself.
            .pipe(catchError(error => this.handleError(error)));  //UPDATED the older way to 'catch'... previously was "  .catch(error => this.handleError(error));
        this.loggedInUser = loginUser;
        //this.loggedInUser.email = loginResponse.;
        return loginResponse;
    }

    logoutUser(): Observable<IUser> {
        let loginResponse = this._http.post<IUser>(this._logoutUrl, this.loggedInUser)
            //.map((response: Response) => <IUser>response.json())  //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>.
            //You no longer need to call the '.map' function above yourself.
            .pipe(catchError(error => this.handleError(error)));  //UPDATED the older way to 'catch'... previously was "  .catch(error => this.handleError(error));
        return loginResponse;
    }

    logoutUserLocal(isRedirect) {
        this.loggedInUser = undefined;
        localStorage.removeItem('token');
        this.isSessionLoggedIn = false;
        if (isRedirect) {
            this._router.navigate(['/login']);
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }

    loggedIn() {
        return (!!localStorage.getItem('token') && this.isSessionLoggedIn);
    }

    handleError(error: HttpErrorResponse) {
        //Change this to pass the exception to some logging service
        console.error(error);
        if (error && error.status == 401) {
            this.logoutUserLocal(true);
        }

        //can PROBABLY include more status codes to handle here

        return throwError(error);
        // return Observable.throw(error);
    }

    encryptUsingAES256(data: string, isUserName: boolean) {
        // console.log('Going to encrypt ' + encrypted);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        if(isUserName) {
            // console.log('UserName, isUserName: ' + isUserName);
            this.encryptedUsername = encrypted;

        } else {
            // console.log('Password, isUserName: ' + isUserName);
            this.encryptedPassword = encrypted;
        }

        console.log('Encrypted: ' + encrypted);
    }

    decryptUsingAES256(decString) {
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // console.log('Decrypted: ' + decrypted);
        // console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
    }
}
