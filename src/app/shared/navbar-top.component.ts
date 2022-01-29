//<!--depracated, NOTHING in this file is being used (just reference, and can/should be deleted in a real project-->
import { Component } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { AuthBehaviorService } from './auth-behavior.service';

@Component({
    selector: 'navbar-top',
    templateUrl: './navbar-top.component.html'
})
export class NavbarTopComponent {
//THIS ENTIRE COMPONENT ALONGSIDE THE HTML IS NOT BEING USED
    constructor(private _auth: AuthService, private _authBehaviorService: AuthBehaviorService) { }
    isCookieEnabled: boolean = true;
    navbarOpen: boolean;
    LogInOrLogOut: string;
    mobileW: string = '767';
    tabletW: string = '992';
    isPhone: boolean;
    isTablet: boolean;
    isLoggedIn: boolean;
    
    //toggleNavbar_click() { this.navbarOpen = !this.navbarOpen; }    

    ngOnInit(){
        //console.log('NavbarTopComponent inside ngOnInit()');
        this._authBehaviorService.currentMessage.subscribe(message => this.LogInOrLogOut = message);
        this._authBehaviorService.loggedInStatus.subscribe(_isLoggedIn => this.isLoggedIn = _isLoggedIn);
        this.isLoggedIn = this._auth.loggedIn();
    }

    ngAfterContentInit() {
        this.isPhone = window.matchMedia("(min-width: " + this.mobileW + "px)").matches;
        this.isTablet = window.matchMedia("(min-width: " + this.tabletW + "px)").matches;
        this.navbarOpen = this.isMobile();  //  <-- is the version used for the Side Navigation version
        //this.navbarOpen = this.isMobile() ? false : true;;  //    <-- is the version used for the NON-SIde Navigation version (would still work here becuase we'd still need a 2nd (inner) nav, i guess)
    }

    isMobile(): boolean { return !this.isPhone && !this.isTablet; }
}
