//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
// import { ExampleModule } from './example/example.module';    //commented out to showcase Lazy Loading
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  //HttpClientModule
// import { HttpModule } from '@angular/http';

//Services
import { AuthService } from './user/auth.service';
import { AuthGuard } from './user/auth-route-guard.service';
import { TokenInterceptorService } from './user/token-interceptor.service';
import { ExampleSingletonService } from './example/exampleSingleton.service';

//Componenets
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './shared/pageNotFound.component';
import { RegisterComponent } from './user/register.component';
import { LoginComponent } from './user/login.component';
import { HeaderComponent } from './shared/header.component';
import { FooterComponent } from './shared/footer.component';

@NgModule({
    imports: [
        // HttpModule,
        HttpClientModule,
        BrowserModule,
        FormsModule,

        //Also, the module to lazy load should NOT be referenced in any other module (if referenced, the module is eager-loaded)
        // ExampleModule,   //commented out to showcase Lazy Loading
        
        AppRoutingModule
        //InMemoryWebApiModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        RegisterComponent,
        PageNotFoundComponent],
    bootstrap: [
        AppComponent
    ],
    providers: [    // placed here because it is used in multiple components
        AuthService,
        AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
        ExampleSingletonService //Moved back here from 'ExampleModule' due to lazy loading errors surrounding "NullInjectorError: No provider for Service, etc.."
    ]
})
export class AppModule { }