//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Components
//import { ReactiveFormComponent } from '../user/reactiveForm.component'; //implementing this causes errors of un-bind-ability, etc

@NgModule({
  imports: [
    //If, in the future, if we add any components, directives or pipes to the shared modeule that need features, we can add them here
  ],
  declarations: [
    //We do not have any components, directovies, or pipes that we want to share wiht other ffreature modules. if we do, we can implement those re-usable's in the declarations array, here
    //Then, to make them available to other feature modules that import this Shared module,  we'll include them in the 'exports' array
  ],
  exports:[ // btw, you CAN export an angular module without, first, importing it.
    CommonModule,
    ReactiveFormsModule //This will probably be best here since a UI'd most likely have multiple forms needed in the application
  ]
})
export class SharedModule { }
