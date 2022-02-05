import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-route-guard.service';
import { NestedUserChildTemplateOneComponent } from './nested-user-child-template-one.component';
import { NesteduserChildTemplateTwoComponent } from './nested-user-child-template-two.component';
import { NestedUserTopComponent } from './nested-user-top.component';

const appRoutes: Routes = [
    //Lazy Loading requires that all the routes in the module to lazy load should have the same prefix.
    //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)    
    { path: '', component: NestedUserTopComponent, canActivate: [AuthGuard] }, //data: { preload: true } (used for PreloaderService),
    { path: 'nested-user-child-template-one', component: NestedUserChildTemplateOneComponent, canActivate: [AuthGuard] },
    { path: 'nested-user-child-template-two', component: NesteduserChildTemplateTwoComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    providers: [AuthGuard],//, AuthService],
})
export class NestedUserRoutingModule { }
