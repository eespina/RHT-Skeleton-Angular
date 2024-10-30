//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
// import { UserModule } from './user/user.module';    //commented out to showcase Lazy Loading
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';  //HttpClientModule
// import { HttpModule } from '@angular/http';
//import {MatIconModule} from '@angular/animations/';
// import { NestedUserModule } from './nested/nested-user.module';

//Services
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-route-guard.service';
import { TokenInterceptorService } from './auth/token-interceptor.service';
// import { UserSingletonService } from './user/userSingleton.service';    //Moved to User Module for lazy loading demostration purposes
import { AuthBehaviorService } from './shared/auth-behavior.service';

//Componenets
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './shared/pageNotFound.component';
import { RegisterComponent } from './auth/register.component';
import { LoginComponent } from './auth/login.component';
// import { HeaderComponent } from './shared/header.component';<!--depracated-->
import { NavbarComponent } from './shared/navbar.component';
// import { NavbarTopComponent } from './shared/navbar-top.component';  //  NO LONGER BEING USED, NOW THAT EACH FOLDER HAS IT'S OWN NAV BAR MODULE
import { FooterComponent } from './shared/footer.component';

//I want these inside the 'NestedUserModule', but the links don't work.
//There's no error, but the links are missing necessary Angular attributes when inspected in a web browser
//As such, there is no Lazy loading for the 'Nested' material
import { NestedNavbarUserComponent } from './nested-user/nested-navbar-user';
import { NestedUserChildTemplateOneComponent } from './nested-user/nested-user-child-template-one.component';
import { NesteduserChildTemplateTwoComponent } from './nested-user/nested-user-child-template-two.component';
import { NestedUserTopComponent } from './nested-user/nested-user-top.component';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        // HeaderComponent,<!--depracated-->
        //NestedUserTopComponent,    nested inside it's own module inside the NESTED folder
        NavbarComponent,
        // NavbarTopComponent,  NO LONGER BEING USED, NOW THAT EACH FOLDER HAS IT'S OWN NAV BAR MODULE
        FooterComponent,
        RegisterComponent,
        //I want these inside the 'NestedUserModule', but the links don't work.
        //There's no error, but the links are missing necessary Angular attributes when inspected in a web browser
        //As such, there is no Lazy loading for the 'Nested' material
        NestedNavbarUserComponent,
        NestedUserTopComponent,
        NestedUserChildTemplateOneComponent,
        NesteduserChildTemplateTwoComponent,
        PageNotFoundComponent
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        FormsModule,
        //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)
        // UserModule,   //commented out to showcase Lazy Loading
        // NestedUserModule,
        AppRoutingModule
        //InMemoryWebApiModule.forRoot()
    ], providers: [
        AuthService,
        AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
        AuthBehaviorService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }