//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ExampleModule } from './example/example.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  //HttpClientModule
// import { HttpModule } from '@angular/http';

//Services
import { AuthService } from './user/auth.service';
import { AuthGuard } from './user/auth-route-guard.service';
import { TokenInterceptorService } from './user/token-interceptor.service';

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
        HttpClientModule,
        BrowserModule,
        FormsModule,
        // HttpModule,
        AppRoutingModule,
        ExampleModule
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
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
        }
    ]
})
export class AppModule { }