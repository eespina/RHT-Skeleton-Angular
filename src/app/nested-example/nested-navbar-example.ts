import { Component, OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'nested-navbar-example',
    templateUrl: './nested-navbar-example.html'
})
export class NestedNavbarExampleComponent implements OnInit {

    constructor(private _auth: AuthService, private _dataService: DataService) { }
    isCookieEnabled: boolean = true;
    navbarOpen: boolean;
    mobileW: string = '767';
    tabletW: string = '992';
    isPhone: boolean;
    isTablet: boolean;
    isLoggedIn: boolean;

    ngOnInit(){
        //console.log('NestedNavbarExampleComponent inside ngOnInit()');
        this._dataService.loggedInStatus.subscribe(_isLoggedIn => this.isLoggedIn = _isLoggedIn);
        //console.log('this._auth.loggedIn() = ' + this._auth.loggedIn());
        this.isLoggedIn = this._auth.loggedIn();
        //console.log('this._auth.loggedIn() AFTER = ' + this._auth.loggedIn());
    }

    ngAfterContentInit() {
        this.isPhone = window.matchMedia("(min-width: " + this.mobileW + "px)").matches;
        this.isTablet = window.matchMedia("(min-width: " + this.tabletW + "px)").matches;
        this.navbarOpen = this.isMobile();  //  <-- is the version used for the Side Navigation version
        //this.navbarOpen = this.isMobile() ? false : true;;  //    <-- is the version used for the NON-SIde Navigation version (would still work here becuase we'd still need a 2nd (inner) nav, i guess)
    }

    isMobile(): boolean { return !this.isPhone && !this.isTablet; }
}
