import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';   //FormGroup and FormControl inherit from AbstractControl
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { ExampleService as ExampleService } from '../examples/example.service';
import { of } from 'rxjs';  //this isn't being used
import { IExample } from './example';

@Component({
    selector: 'example-reactive-form',
    templateUrl: 'example-reactive-form.component.html'
})
export class ExampleReactiveFormComponent implements OnInit {
    exampleFormGroup: FormGroup;
    IsUpdate: boolean;
    ExampleIdValue: string;
    CreateOrUpdate: string;
    example: IExample;
    creatingExample: IExample = {  //for whatever reason, this not being here (initialized) would error out and complain at runtime
        exampleCharacteristic:'', isActive: false, exampleId: '', modifiedBy: '', modifiedDate: new Date(), createdBy: '', createdDate: new Date()
    } as IExample; //needed to Updating and Registration

    //example showing how to use the Component class to hold the validation syntax instead of having it inside the .html
    validationMessages = {
        'exampleCharacteristic': {
            'required': 'Required',
            'minLength': 'Too Short',  //shows 'undefined' at the moment
            'maxLength': 'Too Long' //shows 'undefined' at the moment
        },
        'isActive': {
            'required': 'Required'
        }
        // 'exampleId': {
        //     'required': 'Required'
        // }
    };

    //now that we have 'validationMessages' ready, we need this object to store the validation messages of the form controls that have actually failed validation
    //This is what the UI will actually bind to
    exampleFormErrors = {
        // 'exampleId': '',
        'exampleCharacteristic': '',
        'isActive': ''
    };    // no longer needed since the logValidationErrors method would take care of this at runtime

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private exampleService: ExampleService, private router: Router) { }

    ngOnInit() {
        // console.log("inside ExampleReactiveFormComponent.ngOnInit");
        this.IsUpdate = false;
        
        this.exampleFormGroup = this.fb.group({
            //create key/value pair (key is the name of the child control, and the value is an array)
            //1st element in the array is the default value (in this case, an empty string). The 2nd and 3rd parameters signify sync/async validators
            // exampleId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(508)]],
            exampleCharacteristic: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(508)]],
            isActiveControl: ['active']

            //when it comees to validators, there's 'required', 'requiredTrue', 'email', 'pattern', 'min', 'max', 'minLength', 'maxLength'
        });

        // //exampleCharacteristic - subscribe to the valueChanges observable of exampleCharacteristic formControl
        // this.exampleFormGroup.get('exampleCharacteristic').valueChanges.subscribe(value => {
        //     //specify an annonymous function that gets executed everytime the value of the formControl changes
        //     console.log('exampleCharacteristic value changed to "' + value + '"');
        // });

        // //subscribe to the ROOT form group
        // this.exampleFormGroup.valueChanges.subscribe((jsonValue: any) => {   //'any' is the default type
        //     //specify an annonymous function that gets executed everytime the value of the formControl changes
        //     console.log('example reactive form changed to (json) of ' + JSON.stringify(jsonValue));
        // });

        //automatically do the validation logic through subscription
        this.exampleFormGroup.valueChanges.subscribe((data) => {
            this.logValidationErrors(this.exampleFormGroup);
        });

        // //Every time the contact preference changes, this method, below, would get called. This is better for unit testing as the binding/calling method is NOT in the HTML anymore
        // this.exampleFormGroup.get('isActiveControl').valueChanges.subscribe((data: string) => {
        //     this.onIsActiveControl_Changed(data);
        // });

        //Use the ActivatedRoute service and subscribe to it's paramMap observable. this helps move the ID of whichever example you wish to EDIT
        this.route.paramMap.subscribe(params => {
            //create a const to store the passing parameter
            const exampleId = params.get('exampleId');
            // console.log("ExampleReactiveFormComponent subscribe params.get('exampleId') : " + params.get('exampleId'));
            //console.log(`inside "this.route.paramMap.subscription" with the exampleCharacteristic being ${exampleCharacteristic}`);
            if(exampleId && exampleId != '0'){
                // console.log(`exampleId of ${exampleId} was passed`);
                this.getEditExample(exampleId) //this MAY already be in another service (to get the specific example according to the ID)
                this.IsUpdate = true;
                this.CreateOrUpdate = 'UPDATE';
            }
            else{
                //just use the existing code that shows pretty much nothing beside the number 6 in years of experience
                console.log(`ExampleReactiveFormComponent exampleId was NOT passed, so eID was ${exampleId}`);
                this.CreateOrUpdate = 'CREATE';
            }
            //console.log("isUpdate is " + this.isUpdate + " INSIDE ReactiveFormComponent.ngOnInit");
        });
        // console.log("isUpdate is " + this.isUpdate);
        // console.log("Leaving ExampleReactiveFormComponent.ngOnInit method");
    }

    getEditExample(exampleId: string){
        //console.log('inside getEditexample');
        this.exampleService.getExampleById(exampleId).subscribe(
            (exData) => {
                if (exData == null){
                    console.log('getExampleById returned NO data');
                } else {
                    // console.log('Example Array is = ' + JSON.stringify(exData));
                    this.loadRealDataPatchClick(exData);    //load the entire example data using this PATCH method

                    //populate the example property
                    this.example = exData;
                }
            },
            (error) => {
                console.log(error);
            });
    }

    loadRealDataPatchClick(example: IExample){
        // console.log('loadRealDataPatchClick data: ' + JSON.stringify(example));
        this.exampleFormGroup.patchValue({
            exampleCharacteristic: example.exampleCharacteristic,
            // exampleId: example.exampleId,
            isActive: example.isActive
        });
        this.ExampleIdValue = example.exampleId;
    }

    onExampleFormSubmit(): void {
        // console.log('inside ReactiveForm\'s onExampleFormSubmit()');
        // console.log('creatingExample: '+JSON.stringify(this.creatingExample));
        let isExamplesModelMapped = this.mapFormValuesToExamplesModel();
        // console.log("isUpdate is " + this.IsUpdate);

        if (isExamplesModelMapped){
            if(this.IsUpdate){
                // console.log('Inside ExampleReactiveFormComponent.onSubmit() and "isUpdate" is TRUE');
                this.exampleService.updateExample(this.creatingExample).subscribe(  //subscribe to the observable that returns void
                    //navigate the example to he list route once the update is complete
                    () => this.router.navigate(['/examples/example', this.example.exampleId]),
                    (error: any)  => console.log('ERROR inside onSubmit Editing example: ' + JSON.stringify(error))
                );
                    // console.log('Inside ExampleReactiveFormComponent.onExampleFormSubmit() and "updateExample" method call is finished');
            } else {
                // console.log('Inside ExampleReactiveFormComponent.onExampleFormSubmit() and "isUpdate" is FALSE');
                this.exampleService.createExample(this.creatingExample)
                .subscribe(
                    (newExample) => {
                        if (newExample == null){
                            console.log('Creating a new Example didn\'t go quite as planned for some reason');
                        } else {
                            // console.log('example ' + id + ' CREATED');
                            this.router.navigate(['/examples/example', newExample.exampleId]);
                        }
                    },
                    (error: any)  => {
                        console.log('Changes not saved');
                        //TODO - create a message to the example about the error(s)
                        console.log('ERROR inside onExampleFormSubmit Creating example: ' + JSON.stringify(error));
                    });
            }
        }
    }

    onExampleDelete(): void {
        // console.log('Inside ExampleReactiveFormComponent.onSubmit() and "isUpdate" is TRUE');
        this.exampleService.deleteExampleById(this.ExampleIdValue).subscribe(  //subscribe to the observable that returns void
            //navigate the example to he list route once the update is complete
            () => this.router.navigate(['/examples']),
            (error: any)  => console.log('ERROR inside onExampleDelete example: ' + JSON.stringify(error))
            );
            console.log('Inside ExampleReactiveFormComponent.onExampleDelete() and "onExampleDelete" method call is finished');
        }

    mapFormValuesToExamplesModel(): boolean{
        try{

            //TODO - REMEMBER to check if there are values for the required fields. Required fields are established in the API, so if you send this will empty data, a 400 may get returned from the API
            this.creatingExample.exampleCharacteristic = this.exampleFormGroup.value.exampleCharacteristic;
            this.creatingExample.exampleId = this.ExampleIdValue;
            this.creatingExample.isActive = this.exampleFormGroup.value.isActiveControl.toString() == "active" ? true : false;  
            // console.log('Mapping exampleFormGroup values: ' + JSON.stringify(this.exampleFormGroup.value));
            // console.log('Mapped creatingExample values: ' + JSON.stringify(this.creatingExample));
            return true;
            
        } catch (ex){
            console.log('ERROR inside mapFormValuesToExamplesModel(): ' + ex);
            return false;
        }
    }

    //An example of looping through each control in the group. useful for Rest of controls, enable/disable form controls validation set/clears, mark dirty/touch/etc..
    logValidationErrors(group: FormGroup = this.exampleFormGroup): void {   //use " = this.reactiveFormGroup" to set it as the default value. doing this makes us not have to specify a value for this parameter when we call it from the template 
        //retreive all the keys we have in the group, and just prints them out to the log (notice it does NOT log the nested group)
        //console.log(Object.keys(group.controls));

        //use a loop with a forEach
        Object.keys(group.controls).forEach((key: string) => {//get all the keys and loop over each key

            //the abstractControl variable can be, either, a FormControl or a NESTED FormGroup, so we need to check which it is
            const abstractControl = group.get(key); //get the reference to its associated control by using that key

            this.exampleFormErrors[key] = '';
            if (abstractControl) {
                if (!abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                    const messages = this.validationMessages[key];

                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.exampleFormErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }

            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);   //recursively call the same method for the NESTED form group
            }

            ////if the instance is a formArray, then we have to get inside the forgroup by recursively calling it with the FormGroup being passed in
            //if (abstractControl instanceof FormArray) {
            //    for (const control of abstractControl.controls) {
            //        //need to check if the control in the formarray is an instance of FormGroup, then recursively call the same method for the NESTED form group
            //        if (abstractControl instanceof FormGroup) {
            //            this.logValidationErrors(abstractControl);
            //        }
            //    }
            //} //no reason to need this anymore since the logic for dynamically generated 
        });
    }

    // //dynamically set and clear validators on specific controls
    // onIsActiveControl_Changed(selectedValue: string) {
    //     // console.log('ExampleReactiveFormComponent.onIsActiveControl_Changed selectedValue: ' + selectedValue);
    //     // const isActiveRadioButtonControl = this.exampleFormGroup.get('isActiveControl');
    //     // console.log('ExampleReactiveFormComponent.onIsActiveControl_Changed phoneControl: ' + isActiveRadioButtonControl.value);
    //     // if (selectedValue === 'inactive') {
    //     //     if (Validators) {
    //     //         isActiveRadioButtonControl.setValidators([Validators.required, Validators.minLength(5)]);
    //     //     }
    //     // } else {
    //     //     isActiveRadioButtonControl.clearValidators();
    //     // }

    //     // isActiveRadioButtonControl.updateValueAndValidity();  //immediately triggers the validation. in this example, we want this for forcing the user to enter a phone
    // }

    DisableNestFormClick() {    //example of disabling the NESTED controls only
        //console.log('DisableNestFormClick() method ENTERED');
        const group = this.exampleFormGroup;
        Object.keys(group.controls).forEach((key: string) => {//use a loop with a forEach to get all the keys and loop over each key
            //the abstractControl variable can be, either, a FormControl or a NESTED FormGroup, so we need to check which it is
            const abstractControl = group.get(key); //get the reference to its associated control by using that key
            if (abstractControl instanceof FormGroup) {
                abstractControl.disable();  //this will disable the NESTED controls
            } else {
                //if it's not a nested form, it will mark it as dirty (not useful, but an example of being able to use other in-house techniques)
                abstractControl.markAsDirty();
            }
        });

    }
}