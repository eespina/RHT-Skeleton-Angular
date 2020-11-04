import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from '../user/register.component';
import { ReactiveFormComponent } from '../user/reactiveForm.component';
import { ExampleComponent } from './example.component';
import { ExampleListComponent } from './exampleList.component';
import { AuthGuard } from '../user/auth-route-guard.service';

const appRoutes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], canDeactivate: [AuthGuard] },
    { path: 'reactiveForm/:userName', component: ReactiveFormComponent, canActivate: [AuthGuard] },
    { path: 'examples', component: ExampleListComponent, canActivate: [AuthGuard] }, //data: { preload: true } (used for PreloaderService),
    { path: 'examples/:userName', component: ExampleComponent, canActivate: [AuthGuard] },  //{ path: 'examples/:userName/:id', .....  - to use more parameters
];

@NgModule({
    imports: [ RouterModule.forChild(appRoutes) ],
    providers: [AuthGuard],//, AuthService],
    //exports: [RouterModule]  // this doesn't seem to be necessary (it's in the example though, so ¯\_(ツ)_/¯ )
})
export class ExampleRoutingModule { }