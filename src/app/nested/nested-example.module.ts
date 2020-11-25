//Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NestedExampleRoutingModule } from './nested-example-routing.module';
import { SharedModule } from '../shared/shared.module';

//Components
// import { NestedExampleChildOneComponent } from './nested-example-child-one.component';
// import { NestedExampleChildTwoComponent } from './nested-example-child-two.component';
// import { NestedExampleTopComponent } from './nested-example-top.component';
// import { NestedNavbarExampleComponent } from './nested-navbar-example';


@NgModule({
  imports: [
      NestedExampleRoutingModule,
      FormsModule,
      SharedModule
  ],
  declarations: [
    //   NestedNavbarExampleComponent,
    //   NestedExampleTopComponent,
    //   NestedExampleChildOneComponent,
    //   NestedExampleChildTwoComponent
    ],
    providers: [ ],
    exports: [
        // NestedNavbarExampleComponent

        // NestedNavbarExampleComponent,    //this MAY need to be un-commented
        // NestedExampleTopComponent,    //this MAY need to be un-commented
        // NestedExampleChildOneComponent,    //this MAY need to be un-commented
        // NestedExampleChildTwoComponent    //this MAY need to be un-commented
    ]
})
export class NestedExampleModule {}
