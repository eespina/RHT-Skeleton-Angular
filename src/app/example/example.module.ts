//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { ExampleRoutingModule } from './example-routing.module';

//Services
import { ExampleService } from './example.service'; //COULD have stayed in the root module, but moved here since this is specific to EXAMPLE things anyway
import { ExampleSingletonService } from './exampleSingleton.service'; //COULD have stayed in the root module, but moved here since this is specific to EXAMPLE things anyway

//Components
import { ExampleDisplayComponent } from './example-display.component';
import { ExampleListComponent } from './exampleList.component';
import { ExampleComponent } from './example.component';
import { ExampleCountComponent } from './exampleCount.component';
import { ReactiveFormComponent } from '../user/reactiveForm.component';


@NgModule({
  imports: [
    CommonModule,
    ExampleRoutingModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ReactiveFormComponent ,
    ExampleListComponent,
    ExampleDisplayComponent,
    ExampleCountComponent,
    ExampleComponent],
    providers:[
      ExampleService,
      ExampleSingletonService
    ],
    exports:[

      //an example that show that Any module that import this Example Module. example is inside the register.component.html page and it should now show both forms
      //I do NOT beleive that anything is really dependent upon this
      ReactiveFormComponent
    ]
})
export class ExampleModule {
  //created this file for the sole purpose of alleviating the amount of imports inside the already expanded AppModule class
}
