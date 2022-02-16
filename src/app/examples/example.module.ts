//Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AppRoutingModule } from '../app-routing.module';  //Is commented out because it causes errors about multiple module loading when in play
import { ExampleRoutingModule } from './example-routing.module';
import { SharedModule } from '../shared/shared.module';

//Services
import { ExampleService } from './example.service'; //COULD have stayed in the root module, but moved here since this is specific to EXAMPLE things anyway
import { ExampleSingletonService } from './exampleSingleton.service';
import { UserService } from '../users/user.service'

//Components
import { ExampleDisplayComponent } from './example-display.component';
import { ExampleListComponent } from './exampleList.component';
import { ExampleComponent } from './example.component';
import { ExampleCountComponent } from './exampleCount.component';
import { ExampleReactiveFormComponent } from './example-reactive-form.component';

@NgModule({
  imports: [
    ExampleRoutingModule,
    // AppRoutingModule,  //Is commented out because it causes errors about multiple module loading when in play
    FormsModule,
    SharedModule
  ],
  declarations: [
    ExampleReactiveFormComponent,
    ExampleListComponent,
    ExampleDisplayComponent,
    ExampleCountComponent,
    ExampleComponent
  ],
  providers: [
    ExampleService,
    ExampleSingletonService, 
    UserService
  ],
  exports: [

    // //an example that show that Any module that import this Example Module. example is inside the register.component.html page and it should now show both forms
    // //I do NOT beleive that anything is really dependent upon this
    // ReactiveFormComponent  //this is no longer needed as I have commented out the register.componenet.html area that contains this selector
  ]
})
export class ExampleModule {
  //created this file for the sole purpose of alleviating the amount of imports inside the already expanded AppModule class
}
