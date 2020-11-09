import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes, PreloadAllModules } from '@angular/router';  //Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, 
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login.component';
import { PageNotFoundComponent } from './shared/pageNotFound.component';
import { AuthGuard } from './user/auth-route-guard.service';
// import { PreloaderService } from './shared/preloader.service';   TODO - maybe fix this
import { AuthService } from './user/auth.service';
import { CustomPreloadingService } from './custom-preloading.service';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    
    //, loadChildren: 'app/examples/example.module#ExampleModule' }, //AFTER refactoring to Feature Modules, use this to implement, if desired,
    //Lazy Loading of Features in the future(ALSO, remove the 'path' attribute in the Feature Module's @ngModule RouterModule.forChild([ { path: [HERE] } ])..
    //should actually leave ONLY the Children(but outside the 'children' attrubite(so, should have curlybrace - separated array of path routes afterward)))
        //example above is from another tutorial. example below is from recent tutorial that is part of this Feature branch set.
    // { path: 'examples', loadChildren: './example/example.module#ExampleModule' },
    {
        path: 'examples',
        data: {
            preload: true   //use this property to determine if we want a given lazy loaded property to be preloaded or not
        },
        loadChildren: () => import('./example/example.module').then(m => m.ExampleModule)
    },
    //Lazy Loading requires that all the routes in the module to lazy load should have the same prefix.
    //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)

    //Below demonstrates a part of the Resolve Guard that would provide a service to not show undesired portions of a page until loading material/data have been fetched.
    //  We're handling it differntly by using a "loading... " UI display alongside an ' *ngIf ' element handler
    //{ path: 'nonExistantPath', component: ExampleListComponent, resolve: { exampleList: ExampleListResolveService (service that does NOT exist) }}
    
    { path: '**', component: PageNotFoundComponent }    //Precedence matters, use this last as a'Catch All' route
];

@NgModule({
    imports: [
        //RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules })   //NoPreloading is another option and it's the default, i think.

        //the version above is commented out, but can be used as an out-of-the-box version of handling preloaded modules.
        //If used. it preloads the modules without caring if the module wants to be preloaded or not
        RouterModule.forRoot(appRoutes, {preloadingStrategy: CustomPreloadingService })

        // add ALL options together (i.e. preloadingStrategy AND enableTracing)
        //, { enableTracing: true }) //enables NavigationStart, RoutesRecognized, NavigationEnd, NavigationCanceled, NavigationError (and more, i think) which all can then be seen in the console
        //, { preloadingStrategy: PreloaderService })    //canLoad blocks pre loading
    ],
    providers: [AuthGuard, AuthService],
    exports: [RouterModule]  // this gives any importing module's declarations access to the Router directive when AppRoutingModule is imported
})
export class AppRoutingModule {
    constructor(private router: Router) {
        console.log('Hey everybody, I\'m inside the AppRoutingModule constructor!');
    }
}