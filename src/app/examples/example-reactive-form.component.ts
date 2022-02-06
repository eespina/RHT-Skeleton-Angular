import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';   //FormGroup and FormControl inherit from AbstractControl
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { ExampleService as ExampleService } from '../examples/example.service';
import { of } from 'rxjs';  //this isn't being used
import { IExample } from './example';

@Component({
    selector: 'reactive-form-user',
    templateUrl: './example-reactive-form.component.html'
})
export class ExampleReactiveFormComponent implements OnInit {
    exampleFormGroup: FormGroup;
    isUpdate: boolean;
    CreateOrUpdate: string;
    example: IExample;
    creatingExample: IExample = {  //for whatever reason, this not being here (initialized) would error out and complain at runtime
        exampleCharacteristic:'', isActive: true, exampleId: ''
    } as IExample; //needed to Updating and Registration

    //example showing how to use the Component class to hold the validation syntax instead of having it inside the .html
    validationMessages = {
        'exampleCharacteristic': {
            'required': 'Required',
            'minLength': 'Too Short',  //shows 'undefined' at the moment
            'maxLength': 'Too Long' //shows 'undefined' at the moment
        }
    };

    //now that we have 'validationMessages' ready, we need this object to store the validation messages of the form controls that have actually failed validation
    //This is what the UI will actually bind to
    exampleFormErrors = {
        'exampleCharacteristic': ''
    };    // no longer needed since the logValidationErrors method would take care of this at runtime

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private exampleService: ExampleService, private router: Router) { }

    ngOnInit() {
        //console.log("inside ReactiveFormComponent.ngOnInit");
        //console.log("isUpdate is " + this.isUpdate);
        this.exampleFormGroup = this.fb.group({
            //create key/value pair (key is the name of the child control, and the value is an array)
            //1st element in the array is the default value (in this case, an empty string). The 2nd and 3rd parameters signify sync/async validators
            exampleCharacteristic: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(508)]]

            //when it comees to validators, there's 'required', 'requiredTrue', 'email', 'pattern', 'min', 'max', 'minLength', 'maxLength'
        });

        //exampleCharacteristic - subscribe to the valueChanges observable of exampleCharacteristic formControl
        this.exampleFormGroup.get('exampleCharacteristic').valueChanges.subscribe(value => {
            //specify an annonymous function that gets executed everytime the value of the formControl changes
            console.log('exampleCharacteristic value changed to "' + value + '"');
        });

        //subscribe to the ROOT form group
        this.exampleFormGroup.valueChanges.subscribe((jsonValue: any) => {   //'any' is the default type
            //specify an annonymous function that gets executed everytime the value of the formControl changes
            console.log('example reactive form changed to (json) of ' + JSON.stringify(jsonValue));
        });

        //automatically do the validation logic through subscription
        this.exampleFormGroup.valueChanges.subscribe((data) => {
            this.logValidationErrors(this.exampleFormGroup);
        });

        //Use the ActivatedRoute service and subscribe to it's paramMap observable. this helps move the ID of whichever user you wish to EDIT
        this.route.paramMap.subscribe(params => {
            //create a const to store the passing parameter
            const exampleId = params.get('exampleId');
            //console.log(`inside "this.route.paramMap.subscription" with the exampleCharacteristic being ${exampleCharacteristic}`);
            if(exampleId && exampleId != '0'){
                console.log(`userId of ${exampleId} was passed`);
                this.getEditExample(exampleId) //this MAY already be in another service (to get the specific user according to the ID)
                this.isUpdate = true;
                this.CreateOrUpdate = 'UPDATE';
            }
            else{
                //just use the existing code that shows pretty much nothing beside the number 6 in years of experience
                console.log(`userId was NOT passed, so eID was ${exampleId}`);
                this.isUpdate = false;
                this.CreateOrUpdate = 'CREATE';
            }
            //console.log("isUpdate is " + this.isUpdate + " INSIDE ReactiveFormComponent.ngOnInit");
        });
        console.log("isUpdate is " + this.isUpdate);
        console.log("Leaving ReactiveFormComponent.ngOnInit method");
    }

    getEditExample(exampleId: string){
        //console.log('inside getEditUser');
        this.exampleService.getExampleById(exampleId).subscribe(
            (exData) => {
                if (exData == null){
                    console.log('getExampleById returned NO data');
                } else {
                    console.log('Example Array is = ' + JSON.stringify(exData));
                    this.loadRealDataPatchClick(exData);    //load the entire user data using this PATCH method

                    //populate the user property
                    this.example = exData;
                }
            },
            (error) => {
                //console.log(error);
            });
    }

    loadRealDataPatchClick(example: IExample){
        this.exampleFormGroup.patchValue({
            exampleCharacteristic: example.exampleCharacteristic
        });
    }

    onSubmit(): void {
        //console.log('inside ReactiveForm\'s onSubmit()');
        //console.log(this.reactiveFormGroup.value);  //right now, just prints the object

        if (this.mapFormValuesToUsersModel()){
            if(this.isUpdate){
                this.exampleService.updateExample(this.creatingExample).subscribe(  //subscribe to the observable that returns void
                    //navigate the user to he list route once the update is complete
                    () => this.router.navigate(['/examples/example', this.example.exampleId]),
                    (error: any)  => console.log('ERROR inside onSubmit Editing User: ' + JSON.stringify(error)));
            } else {
                console.log('Inside onSubmit(). mapFormValuesToUsersModel is True and we\'re trying to CREATE');
                this.exampleService.createUser(this.creatingExample)
                .subscribe(
                    () => {
                        //console.log('user ' + this.user.userName + ' CREATED');
                        this.router.navigate(['/examples/example', this.creatingExample.exampleCharacteristic]);
                    },
                    (error: any)  => {
                        //console.log('Changes not saved');
                        //TODO - create a message to the user about the error(s)
                        console.log('ERROR inside onSubmit Creating User: ' + JSON.stringify(error));
                    });
            }
        }
    }

    mapFormValuesToUsersModel(): boolean{
        try{

            //TODO - REMEMBER to check if there are values for the required fields. Required fields are established in the API, so if you send this will empty data, a 400 may get returned from the API
            this.creatingExample.exampleCharacteristic = this.exampleFormGroup.value.exampleCharacteristic;
            return true;
            
        } catch (ex){
            console.log('ERROR inside mapFormValuesToUsersModel(): ' + ex);
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