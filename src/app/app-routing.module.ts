import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login.component';
import { PageNotFoundComponent } from './shared/pageNotFound.component';
import { AuthGuard } from './user/auth-route-guard.service';
// import { PreloaderService } from './shared/preloader.service';   TODO - maybe fix this
import { AuthService } from './user/auth.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'home', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: '**', component: PageNotFoundComponent }    //Precedence matters, use this last as a'Catch All' route
            //, loadChildren: 'app/examples/example.module#ExampleModule' }, //AFTER refactoring to Feature Modules, use this to implement, if desired,
            //Lazy Loading of Features in the future(ALSO, remove the 'path' attribute in the Feature Module's @ngModule RouterModule.forChild([ { path: [HERE] } ])..
            //should actually leave ONLY the Children(but outside the 'children' attrubite(so, should have curlybrace - separated array of path routes afterward)))

            //Below demonstrates a part of the Resolve Guard that would provide a service to not show undesired portions of a page until loading material/data have been fetched.
            //  We're handling it differntly by using a "loading... " UI display alongside an ' *ngIf ' element handler
            //{ path: 'nonExistantPath', component: ExampleListComponent, resolve: { exampleList: ExampleListResolveService (service that does NOT exist) }}
        ])
        // add ALL options together (i.e. preloadingStrategy AND enableTracing)
        //, { enableTracing: true }) //enables NavigationStart, RoutesRecognized, NavigationEnd, NavigationCanceled, NavigationError (and more, i think) which all can then be seen in the console
        //, { preloadingStrategy: PreloaderService })    //canLoad blocks pre loading
    ],
    providers: [AuthGuard, AuthService],
    exports: [RouterModule]  // this gives any importing module's declarations access to the Router directive when AppRoutingModule is imported
})
export class AppRoutingModule {
    constructor(private router: Router) {
        console.log('Hey everybody, I\'m inside the AppRoutingModule !');
    }
}