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
    successfulLogin: boolean;
    message:string;

    loginUserInfo: IUser = { userName: '', password: '' } as IUser;
    constructor(private _auth: AuthService, private _router: Router, private _dataService: DataService) { }

    ngOnInit() {
        this._dataService.currentMessage.subscribe(message => this.message = message);
    }

    loginUser() {
        if (this.loginUserInfo.userName != '' && this.loginUserInfo.password != '') {
            this._auth.loginUser(this.loginUserInfo)
                .subscribe(
                res => {
                    localStorage.setItem('token', res.tokenHandleViewModel.token);
                    console.log('CHANGING LogInOrOutStatus to \'Log Out\'');
                    this._dataService.changeLogInOrOutStatus("Log Out");//document.getElementById('loginLogoutPlaceholder').innerText = "Log Out";
                    this.successfulLogin = true;
                    this._router.navigate(['/home']);
                    this._auth.loggedInUser.email = res.email;
                    this._auth.loggedInUser.tokenHandleViewModel = res.tokenHandleViewModel;
                },
                err => {
                    localStorage.removeItem('token')//probably wont have a token anyway, but whatever.
                    document.getElementById('serverError').style.visibility = 'visible';
                    document.getElementById('usernameError').style.visibility = 'hidden';
                    document.getElementById('passwordError').style.visibility = 'hidden';
                });
            this._auth.isSessionLoggedIn = true;//shouldn't this be inside the Subscribe ???
        }

        if (this.loginUserInfo.userName == '') {
            document.getElementById('usernameError').style.visibility = 'visible';
            document.getElementById('serverError').style.visibility = 'hidden';
        } else {
            document.getElementById('usernameError').style.visibility = 'hidden';
        }
        if (this.loginUserInfo.password == '') {
            document.getElementById('passwordError').style.visibility = 'visible';
            document.getElementById('serverError').style.visibility = 'hidden';
        } else {
            document.getElementById('usernameError').style.visibility = 'hidden';
        }
    }
}