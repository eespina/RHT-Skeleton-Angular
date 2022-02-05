//Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NestedUserRoutingModule } from './nested-user-routing.module';
import { SharedModule } from '../shared/shared.module';

//Components
// import { NestedExampleChildOneComponent } from './nested-example-child-template-one.component';
// import { NestedExampleChildTwoComponent } from './nested-example-child-template-two.component';
// import { NestedExampleTopComponent } from './nested-example-top.component';
// import { NestedNavbarExampleComponent } from './nested-navbar-user';


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
