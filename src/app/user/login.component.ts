import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router'
import { IUser } from '../user/user';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    @Output()
    isSuccessfulLogin: boolean = true;
    message:string;

    loginUserInfo: IUser = { userName: '', password: '' } as IUser;
    constructor(private _auth: AuthService, private _router: Router, private _dataService: DataService) {
        console.log('INSIDE constructor. successfulLogin = ' + this.isSuccessfulLogin);
    }

    ngOnInit() {
        this._dataService.currentMessage.subscribe(message => this.message = message);
        console.log('INSIDE ngOnInit(). successfulLogin = ' + this.isSuccessfulLogin);
    }

    loginUser() {
        console.log('INSIDE loginUser. successfulLogin = ' + this.isSuccessfulLogin);
        if (this.loginUserInfo.userName != '' && this.loginUserInfo.password != '') {
            console.log('login INFO is NOT blank');
            this._auth.loginUser(this.loginUserInfo)
                .subscribe(
                res => {
                    console.log('Login SUCCESSFULL');
                    localStorage.setItem('token', res.tokenHandleViewModel.token);
                    console.log('CHANGING LogInOrOutStatus to \'Log Out\'');
                    this._dataService.changeLogInOrOutStatus("Log Out");//document.getElementById('loginLogoutPlaceholder').innerText = "Log Out";
                    this.isSuccessfulLogin = true;
                    this._router.navigate(['/home']);
                    this._auth.loggedInUser.email = res.email;
                    this._auth.loggedInUser.tokenHandleViewModel = res.tokenHandleViewModel;
                },
                err => {
                    console.log('ERROR INSIDE loginUser ' + err.message);
                    console.log('err error (from Server) = ' + err.error);
                    console.log('err status = ' + err.status);
                    console.log('err statusText = ' + err.statusText);

                    localStorage.removeItem('token')//probably wont have a token anyway, but whatever.
                });
            this._auth.isSessionLoggedIn = true;//shouldn't this be inside the Subscribe ???
        } else {
            this.isSuccessfulLogin = false;
        }
        
        console.log('LEAVING loginUser. successfulLogin = ' + this.isSuccessfulLogin);
    }
}