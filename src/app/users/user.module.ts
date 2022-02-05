//Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AppRoutingModule } from '../app-routing.module';  //Is commented out because it causes errors about multiple module loading when in play
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

//Services
import { UserService } from './user.service'; //COULD have stayed in the root module, but moved here since this is specific to EXAMPLE things anyway
import { UserSingletonService } from './userSingleton.service';

//Components
import { UserDisplayComponent } from './user-display.component';
import { UserListComponent } from './userList.component';
import { UserComponent } from './user.component';
import { UserCountComponent } from './userCount.component';
import { ReactiveFormComponent } from '../auth/reactiveForm.component';


@NgModule({
  imports: [
    UserRoutingModule,
    // AppRoutingModule,  //Is commented out because it causes errors about multiple module loading when in play
    FormsModule,
    SharedModule
  ],
  declarations: [
    ReactiveFormComponent,
    UserListComponent,
    UserDisplayComponent,
    UserCountComponent,
    UserComponent
  ],
  providers: [
    UserService,
    UserSingletonService
  ],
  exports: [

    // //an example that show that Any module that import this User Module. example is inside the register.component.html page and it should now show both forms
    // //I do NOT beleive that anything is really dependent upon this
    // ReactiveFormComponent  //this is no longer needed as I have commented out the register.componenet.html area that contains this selector
  ]
})
export class UserModule {
  //created this file for the sole purpose of alleviating the amount of imports inside the already expanded AppModule class
}
