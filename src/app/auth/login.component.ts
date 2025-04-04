import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'
import { ILoginInfo, IAuthUser } from './authUser';
import { AuthBehaviorService } from '../shared/auth-behavior.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    @Output()
    isSuccessfulLogin: boolean = true;
    isUserNameBlank: boolean = true;
    isUserCredentialsBlank: boolean = true;
    message:string;

    loginUserInfo: ILoginInfo = { userName: '', password: '' } as ILoginInfo;
    constructor(private _auth: AuthService, private _router: Router, private _authBehaviorService: AuthBehaviorService) {
        //console.log('INSIDE constructor. successfulLogin = ' + this.isSuccessfulLogin);
    }

    ngOnInit() {
        this._authBehaviorService.currentMessage.subscribe(message => this.message = message);
        //console.log('INSIDE ngOnInit(). successfulLogin = ' + this.isSuccessfulLogin);
    }

    loginUser() {
        this.isSuccessfulLogin = true;
        this.isUserNameBlank = true;
        this.isUserCredentialsBlank = true;

        //console.log('INSIDE loginUser. successfulLogin = ' + this.isSuccessfulLogin);
        if (this.loginUserInfo.userName != '' && this.loginUserInfo.password != '') {
            // console.log('login INFO is NOT blank' + JSON.stringify(this.loginUserInfo))
            this._auth.loginUser(this.loginUserInfo)
                .subscribe(
                res => {
                    //console.log('Login SUCCESSFULL');
                    localStorage.setItem('token', res.tokenHandleViewModel.token);
                    //console.log('CHANGING LogInOrOutStatus to \'Log Out\'');
                    this._authBehaviorService.changeLogInOrOutStatus("Log Out");//document.getElementById('loginLogoutPlaceholder').innerText = "Log Out";
                    this._authBehaviorService.changeLoggedInStatus(true);
                    this.isSuccessfulLogin = true;
                    this._router.navigate(['/home']);
                    this._auth.loggedInUser = res;
                    console.log('After loggin in, loginUser:' + JSON.stringify(this._auth.loggedInUser));
                },
                err => {
                    console.log('ERROR INSIDE loginUser ' + err.message);
                    console.log('Err error (from Server) = ' + err.error);
                    console.log('Err status = ' + err.status);
                    console.log('Err statusText = ' + err.statusText);

                    localStorage.removeItem('token')//probably wont have a token anyway, but whatever.
                    this.loginUserInfo.password = ''
                    this.isSuccessfulLogin = false;
                });
            this._auth.isSessionLoggedIn = true;//shouldn't this be inside the Subscribe ???
        } else {
            if(!this.loginUserInfo.userName){ this.isUserNameBlank = false; }
            if(!this.loginUserInfo.password){ this.isUserCredentialsBlank = false; }
        }
        
        //console.log('LEAVING loginUser. successfulLogin = ' + this.isSuccessfulLogin);
    }
}