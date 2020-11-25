//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
// import { ExampleModule } from './example/example.module';    //commented out to showcase Lazy Loading
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  //HttpClientModule
// import { HttpModule } from '@angular/http';
//import {MatIconModule} from '@angular/animations/';
// import { NestedExampleModule } from './nested/nested-example.module';

//Services
import { AuthService } from './user/auth.service';
import { AuthGuard } from './user/auth-route-guard.service';
import { TokenInterceptorService } from './user/token-interceptor.service';
// import { ExampleSingletonService } from './example/exampleSingleton.service';    //Moved to Example Module for lazy loading demostration purposes
import { DataService } from './shared/data.service';

//Componenets
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './shared/pageNotFound.component';
import { RegisterComponent } from './user/register.component';
import { LoginComponent } from './user/login.component';
// import { HeaderComponent } from './shared/header.component';<!--depracated-->
import { NavbarComponent } from './shared/navbar.component';
// import { NavbarTopComponent } from './shared/navbar-top.component';  //  NO LONGER BEING USED, NOW THAT EACH FOLDER HAS IT'S OWN NAV BAR MODULE
//import { NestedExampleTopComponent } from './nested/nested-example-top.component';    nested inside it's own module inside the NESTED folder
import { FooterComponent } from './shared/footer.component';

@NgModule({
    imports: [
        // HttpModule,
        HttpClientModule,
        BrowserModule,
        FormsModule,

        //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)
        // ExampleModule,   //commented out to showcase Lazy Loading
        // NestedExampleModule,

        AppRoutingModule
        //InMemoryWebApiModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        // HeaderComponent,<!--depracated-->
        //NestedExampleTopComponent,    nested inside it's own module inside the NESTED folder
        NavbarComponent,
        // NavbarTopComponent,  NO LONGER BEING USED, NOW THAT EACH FOLDER HAS IT'S OWN NAV BAR MODULE
        FooterComponent,
        RegisterComponent,
        PageNotFoundComponent],
    bootstrap: [
        AppComponent
    ],
    providers: [    // placed here because it is used in multiple components
        AuthService,
        AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
        DataService,    //Example of using a share-able service between the Login and Header Components (but can be used for much mroe userful shared services)
        // ExampleSingletonService    //Moved to Example Module for lazy loading demostration purposes
    ]
})
export class AppModule { }