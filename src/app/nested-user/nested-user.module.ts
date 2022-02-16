//Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NestedUserRoutingModule } from './nested-user-routing.module';
import { SharedModule } from '../shared/shared.module';

//Components
// import { NestedUserChildOneComponent } from './nested-user-child-template-one.component';
// import { NestedUserChildTwoComponent } from './nested-user-child-template-two.component';
// import { NestedUserTopComponent } from './nested-user-top.component';
// import { NestedNavbarUserComponent } from './nested-navbar-user';


@NgModule({
  imports: [
      NestedUserRoutingModule,
      FormsModule,
      SharedModule
  ],
  declarations: [
    //   NestedNavbarUserComponent,
    //   NestedUserTopComponent,
    //   NestedUserChildOneComponent,
    //   NestedUserChildTwoComponent
    ],
    providers: [ ],
    exports: [
        // NestedNavbarUserComponent

        // NestedNavbarUserComponent,    //this MAY need to be un-commented
        // NestedUserTopComponent,    //this MAY need to be un-commented
        // NestedUserChildOneComponent,    //this MAY need to be un-commented
        // NestedUserChildTwoComponent    //this MAY need to be un-commented
    ]
})
export class NestedUserModule {}
