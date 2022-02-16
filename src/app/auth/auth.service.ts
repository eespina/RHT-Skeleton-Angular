import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { IAuthUser } from './authUser';
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

    loggedInUser: IAuthUser;
    isSessionLoggedIn: boolean;
    
    encryptedUsername: string;
    encryptedPassword: string;
    decryptedUsername: string;
    decryptedPassword: string;
    redirectUrl: string;

    constructor(private _http: HttpClient, private _router: Router) {   //, private messageService: MessageService)
        this.isSessionLoggedIn = false;
    }

    registerUser(registeringUser, reticulatingsplines): Observable<IAuthUser> {
        console.log('inside AuthService.registerUser()');
        
        //NOT tested, let's hope this works
        this.encryptUsingAES256(reticulatingsplines, false);
        let headers = new HttpHeaders({ 'reticulatingsplines': this.encryptedPassword.toString() });
        console.log('reticulatingsplines/encryptedPassword.toString(): ' + this.encryptedPassword.toString());

        let registrationResponse = this._http.post<IAuthUser>(this._registerUrl, registeringUser, {headers})
            //.map((response: Response) => <IUser>response.json())  //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>.
            //You no longer need to call the '.map' function above yourself.
            .pipe(catchError(error => this.handleError(error)));  //UPDATED the older way to 'catch'... previously was "  .catch(error => this.handleError(error));

        // this.loggedInUser = registeringUser;

        return registrationResponse;
    }

    loginUser(loginUser): Observable<IAuthUser> {
        // console.log('inside "loginUser" with key: ' + environment.cryptoKey);

        this.encryptUsingAES256(loginUser.userName, true);
        this.encryptUsingAES256(loginUser.password, false);

        let headers = new HttpHeaders();
        headers = headers.append('username', this.encryptedUsername.toString());
        headers = headers.append('password', this.encryptedPassword.toString());
        console.log('_loginUrl: ' + this._loginUrl);
        let loginResponse = this._http.post<IAuthUser>(this._loginUrl, null, {headers})
            //.map((response: Response) => <IUser>response.json())  //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>.
            //You no longer need to call the '.map' function above yourself.
            .pipe(catchError(error => this.handleError(error)));  //UPDATED the older way to 'catch'... previously was "  .catch(error => this.handleError(error));
        console.log('After loggin in, loggedInUser:' + JSON.stringify(this.loggedInUser));
        return loginResponse;
    }

    logoutUser(): Observable<IAuthUser> {
        let loginResponse = this._http.post<IAuthUser>(this._logoutUrl, this.loggedInUser)
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

    resetUserCredentialsById(userId: string): Observable<boolean> {
        if(!userId || userId === ""){
            console.log('User parameter is NOT properly passed. no deletion of user occurred');
        }

        let headers = new HttpHeaders();
        headers = headers.append('administeringuserid', this.loggedInUser.userId.toString());
        headers = headers.append('password', this.encryptedPassword.toString());
        let link = environment.resetCredentialsUrl + '/' + userId;
        console.log('resetUserCredentialsById link: ' + link);
        let isUserSentResetCredentials = this._http.put<boolean>(link, null, {headers}).pipe(catchError(error => this.handleError(error)));

        console.log('Finshed resetUserCredentialsById, isUserSentResetCredentials: ' + isUserSentResetCredentials);
        return isUserSentResetCredentials;
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
        // console.log('encrypted: ' + encrypted);

        if(isUserName) {
            this.encryptedUsername = encrypted;
            // console.log('encryptedUsername: ' + this.encryptedUsername);

        } else {
            this.encryptedPassword = encrypted;
            // console.log('encryptedPassword: ' + this.encryptedPassword);
        }
    }

    decryptUsingAES256(decString) : string {
        // console.log('decString: ' + decString);
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // console.log('Decrypted: ' + decrypted);
        // console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
        return decrypted;
    }
}
