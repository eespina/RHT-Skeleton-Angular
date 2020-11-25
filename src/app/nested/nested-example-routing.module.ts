import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../user/auth-route-guard.service';
import { NestedExampleChildOneComponent } from './nested-example-child-one.component';
import { NestedExampleChildTwoComponent } from './nested-example-child-two.component';
import { NestedExampleTopComponent } from './nested-example-top.component';


const appRoutes: Routes = [
    //Lazy Loading requires that all the routes in the module to lazy load should have the same prefix.
    //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)    
    { path: '', component: NestedExampleTopComponent, canActivate: [AuthGuard] }, //data: { preload: true } (used for PreloaderService),
    { path: 'nested-example-child-one', component: NestedExampleChildOneComponent, canActivate: [AuthGuard] },
    { path: 'nested-example-child-two', component: NestedExampleChildTwoComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    providers: [AuthGuard],//, AuthService],
})
export class NestedExampleRoutingModule { }
