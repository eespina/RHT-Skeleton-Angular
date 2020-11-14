import { Component } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router'

@Component({
    selector: 'responsive-app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {

    constructor(private _auth: AuthService, private _router: Router) { }
    navbarOpen: boolean;
    LogInOrLogOut: string = "Log In";
    mobileW: string = '767';
    tabletW: string = '992';
    isPhone: boolean;
    isTablet: boolean;
    
    toggleNavbar_click() {
        this.navbarOpen = !this.navbarOpen;
    }    

    ngOnInit(){
        console.log('inside ngOnInit()');
    }

    ngAfterContentInit() {
        console.log('inside ngAfterViewInit()');
        this.isPhone = window.matchMedia("(min-width: " + this.mobileW + "px)").matches;
        this.isTablet = window.matchMedia("(min-width: " + this.tabletW + "px)").matches;
        console.log('isPhone = ' + this.isPhone + ', isTablet = ' +  this.isTablet);

        this.navbarOpen = this.isMobile() ? false : true;
        
        console.log('navbarOpen = ' + this.navbarOpen);
    }

    isMobile(): boolean {
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
}
