import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from '../auth/register.component';
import { ReactiveFormComponent } from '../auth/reactiveForm.component';
import { ExampleComponent } from './example.component';
import { ExampleListComponent } from './exampleList.component';
import { AuthGuard } from '../auth/auth-route-guard.service';

const appRoutes: Routes = [
    //Lazy Loading requires that all the routes in the module to lazy load should have the same prefix.
    //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)
    
    { path: '', component: ExampleListComponent, canActivate: [AuthGuard] }, //data: { preload: true } (used for PreloaderService),
    { path: 'example/:exampleId', component: ExampleComponent, canActivate: [AuthGuard] },  //{ path: 'examples/:exampleId/:id', .....  - to use more parameters
    { path: 'exampleCreationReactiveForm/:exampleId', component: ReactiveFormComponent, canActivate: [AuthGuard] }  //, canDeactivate: [AuthGuard] }, <-- having the canDeactivate causes "TypeError: Cannot read property 'dirty' of undefined" when leaving this page
    
    /* --//TODO NEED to make a ExampleReactiveFormComponent
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], canDeactivate: [AuthGuard] },
    { path: 'reactiveForm/:exampleId', component: ReactiveFormComponent, canActivate: [AuthGuard] }  //, canDeactivate: [AuthGuard] }, <-- having the canDeactivate causes "TypeError: Cannot read property 'dirty' of undefined" when leaving this page
    */

    //This way uses /examples/examples (twice, instead of just once, which is less desiable to see as a link (thus it's commented out)). Also would need to be surrounded by curly braces
    // path: 'examples', children: [   //Component-less Route because there's no component associated with it. It only has a path and child properties
    //     { path: '', component: ExampleListComponent, canActivate: [AuthGuard] }, //data: { preload: true } (used for PreloaderService),
    //     { path: 'example/:exampleId', component: ExampleComponent, canActivate: [AuthGuard] },  //{ path: 'examples/:exampleId/:id', .....  - to use more parameters
    //     { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], canDeactivate: [AuthGuard] },
    //     { path: 'reactiveForm/:exampleId', component: ReactiveFormComponent, canActivate: [AuthGuard] }
    // ]

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    providers: [AuthGuard],//, AuthService],
    //exports: [RouterModule]  // this doesn't seem to be necessary (it's in the example guide though, so ¯\_(ツ)_/¯ )
})
export class ExampleRoutingModule { }
