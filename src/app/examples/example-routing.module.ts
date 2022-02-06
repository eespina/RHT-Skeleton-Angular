import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleComponent } from './example.component';
import { ExampleListComponent } from './exampleList.component';
import { AuthGuard } from '../auth/auth-route-guard.service';
import { ExampleReactiveFormComponent } from './example-reactive-form.component';

const appRoutes: Routes = [
    //Lazy Loading requires that all the routes in the module to lazy load should have the same prefix.
    //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)
    
    { path: '', component: ExampleListComponent, canActivate: [AuthGuard] }, //data: { preload: true } (used for PreloaderService),
    { path: 'example/:exampleId', component: ExampleComponent, canActivate: [AuthGuard] },  //{ path: 'examples/:exampleId/:id', .....  - to use more parameters
    // { path: 'example-reactive-form/', component: ExampleReactiveFormComponent, canActivate: [AuthGuard] },
    { path: 'example-reactive-form/:exampleId', component: ExampleReactiveFormComponent, canActivate: [AuthGuard] }  //, canDeactivate: [AuthGuard] }, <-- having the canDeactivate causes "TypeError: Cannot read property 'dirty' of undefined" when leaving this page

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    providers: [AuthGuard],//, AuthService],
    //exports: [RouterModule]  // this doesn't seem to be necessary (it's in the example guide though, so ¯\_(ツ)_/¯ )
})
export class ExampleRoutingModule { }
