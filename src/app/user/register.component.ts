import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router'
import { IUser } from '../user/user';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    isResultVisible: boolean = false;
    isSuccessfulRegistration: boolean = false;
    lblResultContent: string = '';
    registeringUser: IUser = {  //for whatever reason, this not being here (initialized) would error out and complain at runtime
        firstName: '', lastName: '', userName: '', password: '', email: '', administeringUserEmail: '', userType: { id: 0, name: '' }
            , tokenHandleViewModel: { expiration: new Date(), token: ''}, isActive: true
        //, CurrentAdministeringUser: '', userId: '0', isAdmin: false, tokenHandleViewModel: { expiration: '', token: ''}
    } as IUser; //needed to Updating and Registration

    @ViewChild('registrationForm') public createExampleForm: NgForm

    constructor(private _auth: AuthService, private _router: Router) { }

    ngOnInit() { }

    registerUser(exForm: NgForm) {
        //console.log('Inside registerUser function');
        this.registeringUser.userType = { id: 2, name:''};   //TODO - delete the 'name' property (OR, think of something else it would be useful for)
        this.registeringUser.administeringUserEmail = this._auth.loggedInUser.email;
        this.registeringUser.tokenHandleViewModel = this._auth.loggedInUser.tokenHandleViewModel;
        //console.log('this._auth.loggedInUser.email = ' + this._auth.loggedInUser.email);
        //console.log('this.registeringUser.tokenHandleViewModel = ' + this.registeringUser.tokenHandleViewModel);

        //keeps track of the created user after the exForm is RESET (this may not be completely necessary unless I have a redirect to the exampleList (user list) page)
        const exampleHolderObject: IUser = Object.assign({}, this.registeringUser);

        this._auth.registerUser(exampleHolderObject)
            .subscribe(
            res => {
                //console.log('user ' + res.firstName + ' created');
                this.lblResultContent = 'User ' + res.firstName + ' ' + res.lastName + ' (' + res.userName + ') has been created!';
                //console.log('lblResultContent ' + this.lblResultContent);
                this.isResultVisible = true;
                //console.log('isResultVisible = ' + this.isResultVisible);
                this.isSuccessfulRegistration = true;
                //console.log('isSuccessfulRegistration = ' + this.isSuccessfulRegistration);

                exForm.reset(); //reset the form after the for is used. resets data, ie dirty, valid, etc..
                //exForm.reset({ username: 'exampleName', isActive: false  }); //another version with default data being set after the reest
                //this.createExampleForm.reset();   //can also reset the form using this if you have the property. can be used if you do njot want to use a parameter in this method
            },
            err => {
                //console.log(err);
                this.lblResultContent = 'ERROR Occurred.Depending upon the Error, well.. nothing got created!';
                console.log('Err error (from Server) = ' + err.error);
                //console.log('lblResultContent ' + this.lblResultContent);
                console.log('Err message = ' + err.message);
                console.log('Err status = ' + err.status);
                console.log('Err statusText = ' + err.statusText);
                this.isResultVisible = true;
                //console.log('isResultVisible = ' + this.isResultVisible);
                this.isSuccessfulRegistration = false;
                //console.log('isSuccessfulRegistration = ' + this.isSuccessfulRegistration);
            });
            //console.log('LEAVING registerUser function');
    }
}
