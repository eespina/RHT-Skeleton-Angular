import { Component } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router'
import { DataService } from '../shared/data.service';

@Component({
    selector: 'responsive-app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {

    constructor(private _auth: AuthService, private _router: Router, private _dataService: DataService) { }
    isCookieEnabled: boolean = true;
    navbarOpen: boolean;
    LogInOrLogOut: string;
    mobileW: string = '767';
    tabletW: string = '992';
    isPhone: boolean;
    isTablet: boolean;
    
    toggleNavbar_click() {
        this.navbarOpen = !this.navbarOpen;
    }    

    ngOnInit(){
        console.log('inside ngOnInit()');
        this._dataService.currentMessage.subscribe(message => this.LogInOrLogOut = message);
        console.log('LogInOrLogOut = ' + this.LogInOrLogOut);
        this.checkCookie();
        console.log('leaving ngOnInit()');
    }

    ngAfterContentInit() {
        console.log('inside ngAfterViewInit()');
        this.isPhone = window.matchMedia("(min-width: " + this.mobileW + "px)").matches;
        this.isTablet = window.matchMedia("(min-width: " + this.tabletW + "px)").matches;
        console.log('isPhone = ' + this.isPhone + ', isTablet = ' +  this.isTablet);

        this.navbarOpen = this.isMobile();  //  <-- is the version used for the Side Navigation version
        //this.navbarOpen = this.isMobile() ? false : true;;  //    <-- is the version used for the NON-SIde Navigation version

        console.log('navbarOpen = ' + this.navbarOpen);
    }

    isMobile(): boolean {
        //console.log('isMobile = ' + (!this.isPhone && !this.isTablet));   causing too many logs
        return !this.isPhone && !this.isTablet;
    }

    loginOrOutUser() {
        if (this._auth.loggedIn()) {
            this._auth.logoutUser()
            .subscribe(
                res => {
                    this.LogInOrLogOut = "Log In";
                    this._auth.logoutUserLocal(false);// no need to redirect because it will happen after this method is true
                },
                err => {
                    //Log something HERE to somewhere
                    console.log('Error Logging Out User');
                    this._auth.handleError(err);
            });
        }else{
            this.LogInOrLogOut = "Log Out";
        }
        if (this._router) {
            this._router.navigate(['/login']);
        }
    }
    
    checkCookie(){
        console.log('INSIDE navbar\' scheckCookie');
        var cookieEnabled = navigator.cookieEnabled;
        console.log('cookieEnabled = ' +  cookieEnabled);
        if (!cookieEnabled){ 
            // document.cookie = "testcookie";
            // cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
            // console.log('cookieEnabled INSIDE "if" satement = ' +  cookieEnabled);
            this.isCookieEnabled = false;
        }
        console.log('cookieEnabled OUTSIDE = ' +  cookieEnabled);
        var cookieEnabledTwo = navigator.cookieEnabled;
        console.log('cookieEnabledTwo = ' +  cookieEnabledTwo);
        console.log('LEAVING navbar\' scheckCookie');
    }
}
