﻿import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray } from '@angular/forms';   //FormGroup and FormControl inherit from AbstractControl
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { IUser } from '../users/user';
import { IUserArray } from '../users/userArray';
import { IAuthUser } from './authUser';
import { AuthService } from './auth.service';
import { of } from 'rxjs';  //this isn't being used

@Component({
    selector: 'reactive-form-user',
    templateUrl: './reactiveForm.component.html'
})
export class ReactiveFormComponent implements OnInit {
    reactiveFormGroup: UntypedFormGroup;
    IsUpdate: boolean;
    IsEmailChanged: boolean;
    IsPasswordAreaVisible: boolean
    CurrentEmailConstant: string;
    ShowCurrentPasswordForm: boolean;
    registerOrUpdate: string;
    user: IUser;
    authUser: IAuthUser = {  //for whatever reason, this not being here (initialized) would error out and complain at runtime
        firstName: '', lastName: '', userName: '', email: '', administeringUserEmail: '', userType: { id: 0, name: '' }
            , tokenHandleViewModel: { expiration: new Date(), token: ''}, isActive: true
        //, CurrentAdministeringUser: '', userId: '0', isAdmin: false, tokenHandleViewModel: { expiration: '', token: ''}
    } as IAuthUser; //needed to Updating and Registration

    //example showing how to use the Component class to hold the validation syntax instead of having it inside the .html
    validationMessages = {
        'firstName': {
            'required': 'Required',
            'minLength': 'Too Short',  //shows 'undefined' at the moment
            'maxLength': 'Too Long' //shows 'undefined' at the moment
        },
        'lastName': {
            'required': 'Required',
            'minLength': 'Too Short',   //shows 'undefined' at the moment
            'maxLength': 'Too Long' //shows 'undefined' at the moment
        },
        'email': {
            'required': 'Email is Required',
            'email': 'Email must be valid',
            'emailDomainValidator': 'Email must be a "email" domain'
        },
        'confirmEmail': {
            'required': 'Confirm Email is Required',
            'email': 'Email must be valid'
        },
        'emailGroup': {
            'emailMisMatch': 'Emails do NOT match'
        },
        'phone': {
            'required': 'Phone is Required'
        },
        'proficiency': {
            'required': 'Proficiency is Required'
        },
        'dynamicNestedGroupName': {
            'required': 'Requred Field'
        },
        'dynamicExperienceInYears': {
            'required': 'Requred Field'
        },
        'dynamicProficiency': {
            'required': 'Requred Field'
        }
    };

    //now that we have 'validationMessages' ready, we need this object to store the validation messages of the form controls that have actually failed validation
    //This is what the UI will actually bind to
    formErrors = {
        'firstName': '',
        'lastName': '',
        'email': '',
        'confirmEmail': '',
        'emailGroup': '',
        'phone': '',
        'proficiency': '',
        'dynamicNestedGroupName': '',
        'dynamicExperienceInYears': '',
        'dynamicProficiency': ''
    };    // no longer needed since the logValidationErrors method would take care of this at runtime

    constructor(private fb: UntypedFormBuilder, private route: ActivatedRoute, private userService: UserService, private router: Router, private _auth: AuthService) { }

    ngOnInit() {
        console.log("inside ReactiveFormComponent.ngOnInit");
        this.reactiveFormGroup = this.fb.group({
            //create key/value pair (key is the name of the child control, and the value is an array)
            //1st element in the array is the default value (in this case, an empty string). The 2nd and 3rd parameters signify sync/async validators
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(42)]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(42)]],
            userName: [''],
            contactPreference: ['email'],
            usertype: [''],//unassigned
            notes: [''],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.email, CustomValidators.emailDomainValidator('email.com')]],
                confirmEmail: ['', Validators.required]
            }, { validator: CustomValidators.matchEmailValidator }),//tie the customer validator function to the nested form group
            phone: [''],
            currentPassword: [''],
            newPassword: [''],
            nestedGroup: this.fb.group({
                nestedGroupName: [''],
                experienceInYears: ['0'],   /// '6' is an example of using the default value
                proficiency: ['', Validators.required]
            }),
            dynamicNestedGroup: this.fb.array([
                this.addDynamicFormGroup()
            ])

            //when it comees to validators, there's 'required', 'requiredTrue', 'email', 'pattern', 'min', 'max', 'minLength', 'maxLength'
        });
        
        this.ShowCurrentPasswordForm = false;

        this.reactiveFormGroup.get('emailGroup.email').valueChanges.subscribe(value => {
            //specify an annonymous function that gets executed everytime the value of the formControl changes
            this.IsEmailChanged = value.toString() == this.CurrentEmailConstant ? !this.IsUpdate : true;
            // console.log('this.isUpdate: ' + this.isUpdate);
            // console.log('this.IsEmailChanged: ' + this.IsEmailChanged);
            // console.log('value: ' + value);
            // console.log('this.CurrentEmailConstant: ' + this.CurrentEmailConstant);
        });

        this.reactiveFormGroup.get('newPassword').valueChanges.subscribe(value => {
            //specify an annonymous function that gets executed everytime the value of the formControl changes
             this.ShowCurrentPasswordForm = value != "" ? this.IsUpdate : false;
        });

        //firstName - subscribe to the valueChanges observable of firstName formControl
        this.reactiveFormGroup.get('firstName').valueChanges.subscribe(value => {
            //specify an annonymous function that gets executed everytime the value of the formControl changes
            //console.log('firstName value changed to "' + value + '"');
        });

        //lastName - subscribe to the valueChanges observable of lastName formControl
        this.reactiveFormGroup.get('lastName').valueChanges.subscribe((val: string) => {
            //console.log('lastName value length is ' + val.length);
        });

        //subscribe to the ROOT form group
        this.reactiveFormGroup.valueChanges.subscribe((jsonValue: any) => {   //'any' is the default type
            //specify an annonymous function that gets executed everytime the value of the formControl changes
            //console.log('form changed to (json) of ' + JSON.stringify(jsonValue));
        });

        //subscribe to the NESTED form group
        this.reactiveFormGroup.get('nestedGroup').valueChanges.subscribe((jsonValue: any) => {   //'any' is the default type
            //specify an annonymous function that gets executed everytime the value of the formControl changes
            //console.log('NESTED form changed to (json) of ' + JSON.stringify(jsonValue));
        });

        //automatically do the validation logic through subscription
        this.reactiveFormGroup.valueChanges.subscribe((data) => {
            this.logValidationErrors(this.reactiveFormGroup);
        });

        //Every time the contact preference changes, this method, below, would get called. This is better for unit testing as the binding/calling method is NOT in the HTML anymore
        this.reactiveFormGroup.get('contactPreference').valueChanges.subscribe((data: string) => {
            this.onContactPreference_Changed(data);
        });

        this.reactiveFormGroup.get('usertype').valueChanges.subscribe((data: string) => {
            this.onUserType_Changed(data);
        });

        //Use the ActivatedRoute service and subscribe to it's paramMap observable. this helps move the ID of whichever user you wish to EDIT
        this.route.paramMap.subscribe(params => {
            //create a const to store the passing parameter
            const userName = params.get('userName');
            if(userName && userName != '0') {
                this.getEditUser(userName) //this MAY already be in another service (to get the specific user according to the ID)
            } else {
                this.IsPasswordAreaVisible = true;
            }
            this.registerOrUpdate = userName && userName != '0' ? 'UPDATE' : 'REGISTER'
            this.IsUpdate = userName && userName != '0' ? true : false;
            console.log("IsPasswordAreaVisible is " + this.IsPasswordAreaVisible + " INSIDE getEditUser.");
        });
    }

    getEditUser(userName: string){
        console.log('inside getEditUser');
        this.userService.getUserById(userName).subscribe(
            (exData) => {
                if (exData == null){
                    console.log('getUserById returned NO data');
                } else {
                    this.loadRealDataPatchClick(exData);    //load the entire user data using this PATCH method
                    this.user = exData;
                    this.IsPasswordAreaVisible = this.user.userId.trim() === this._auth.loggedInUser.userId.trim();
                    console.log("IsPasswordAreaVisible is " + this.IsPasswordAreaVisible + " INSIDE getEditUser.");
                }
            },
            (error) => {
                console.log(error);
            });
    }

    loadRealDataPatchClick(user: IUser){  //NOT loading properly because we've collaborated IExampel and IUser irresposnsibly
        // console.log('inside loadRealDataPatchClick()');
        if(user){
            // console.log('loadRealDataPatchClick Array is = ' + JSON.stringify(user));
            if(user.userArray){
                console.log('user.userArray.COUNT = ' + user.userArray.length);
            } else {
                console.log('user.userArray is, unfortunately, at ' + user.userArray);
            }
        }

        this.CurrentEmailConstant = user.email;

        //we want to bind the retreived user details to the form controls on the reactiveForm
        this.reactiveFormGroup.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            emailGroup: { email: user.email },
            notes: user.notes,
            currentPassword: '',
            newPassword: ''
        });
        
        //Binding existing data to a form array, use the SET CONTROL method
        this.reactiveFormGroup.setControl('dynamicNestedGroup', this.setExistingDynamicFormGroupWithFakeData(user.userArray)) //use this method to replace an existing control (in this case, its the fff array)
    }

    setExistingDynamicFormGroupWithFakeData(dynamicUserSet: IUserArray[]): UntypedFormArray{
        // console.log('inside setExistingDynamicFormGroupWithFakeData method');
        let formArray = new UntypedFormArray([]);
        if(dynamicUserSet && dynamicUserSet.length > 0){            
            // console.log('THERE ARE dynamicUserSet.');
            //loop through each dynamicUserSet set
            dynamicUserSet.forEach(d => {
                formArray.push( this.fb.group({
                    dynamicNestedGroupName: d.dynamicNestedGroupName,
                    dynamicExperienceInYears: d.dynamicExperienceInYears,
                    dynamicProficiency: d.dynamicProficiency
                }));
            });

        }

        return formArray;
    }

    /*  below is the technique of using Reractive forms WITHOUT FormBuilder. It only uses FormGroup and FormControl and it has a parameterless constructor.
        The FormControl is no longer in use and can be un-imported

    constructor() { }

    ngOnInit() {
        this.reactiveFormGroup = new FormGroup({
            firstName: new FormControl(),
            lastName: new FormControl(),
            userName: new FormControl(),
            email: new FormControl(),
            phone: new FormControl(),
            currentPassword: new FormControl(),

            //Nested Form Group Users (not yet persisted in any kind of memory)
            nestedGroup: new FormGroup({
                nestedGroupName: new FormControl(),
                experienceInYears: new FormControl(),
                proficiency: new FormControl()
            })
        });
    }
    
    */

    loadFakeDataClick(): void {

        //console.log('inside loadFakeDataClick method');

        //-------------------------- FormArray Example
        const formArray = new UntypedFormArray([//can create a Formarray like this, with the 'new' keyword
            new UntypedFormControl('Glenn', Validators.required),
            new UntypedFormGroup({
                country: new UntypedFormControl('', Validators.required)
            }),
            new UntypedFormArray([])
        ]);

        //console.log(formArray.length);  //should print out the number '3' for each indece in the formArray

        //iterate over each index (FormControl, FormGroup or FormArray) in the array
        for (const control of formArray.controls) {
            if (control instanceof UntypedFormControl) {
                //do something to the control that is a FormControl
            }
            if (control instanceof UntypedFormGroup) {
                //do something to the control that is a FormGroup
            }
            if (control instanceof UntypedFormArray) {
                //do something to the control that is a FormArray
            }
        }

        //it's more common to use arrays with like types, however, you can use them with mixed types like the 'formArray' examples
        const formBuilderArray = this.fb.array([
            new UntypedFormControl('Glenn', Validators.required),//name
            new UntypedFormControl('IT', Validators.required),//department
            new UntypedFormControl('', Validators.required)//Gender
        ]);

        //FormArray Useful METHODS
        //push - Inserts the control at the end of the array    (i.e "formBuilderArray.push(new FormControl('Caleb', Validators.required));")
        //insert - Inserts the control at the specified index in the array
        //removeAt - Removes the control at the specified index in the array
        //setControl - Replace an existing control at the specified index
        //at - Return the control at the specified index in the array   (i.e "formBuilderArray.at(3).value;" .... would return 'Caleb')

        //using a FormGroup to create the same group of FormControls

        //it's more common to use arrays with like types, however, you can use them with mixed types like the 'formArray' examples
        const formGroup = this.fb.group([
            new UntypedFormControl('Glenn', Validators.required),//name
            new UntypedFormControl('IT', Validators.required),//department
            new UntypedFormControl('', Validators.required)//Gender
        ]);

        //DIFFERENCES between a formGroup and a formArray (as in the similarities between the two groups above) are that 
        //formarray data is serialized as an array whereas a formgroup is serialized as an Object. FormArrays are usefull for dynamically creating groups and controls

        //The FormArray items (above) are designed not to show, I would imaginge it's just passing one of the groups (above) into the 'this.reactiveFormGroup.setValue()' method (below)

        //-------------------------- FormArray Example END


        //This is just fake data that exists so I don't have to sample data from the database (or any persisted information)
        this.reactiveFormGroup.setValue({   //  "setValue" would be useful for setting data loaded from some other material
        
            firstName: 'FakeFirstname',
            lastName: '',
            userName: 'FakeUserName',
            phone: '1234568',
            currentPassword: 'FakePassword',
            newPassword: 'FakeNewPassword',
            contactPreference: '',
            notes: 'fake notes',
            usertype: '',

            //Nested Form Group Users (not yet persisted in any kind of memory)
            nestedGroup: {
                nestedGroupName: 'FakenestedGroupName',
                experienceInYears: 1234,
                proficiency: ''
            },

            //Nested Form Group Users (not yet persisted in any kind of memory)
            emailGroup: {
                email: 'email@email.com',
                confirmEmail: 'email@email.com'
            }
        });

        //now we're also logging to the console through the following method
        this.logValidationErrors(this.reactiveFormGroup);
        //console.log('loadFakeDataClick are ' + this.formErrors + '. FINISHED with the method');
    }

    //This is the PATCH version that would NOT include the nested values. If you used the setValue in the "loadFakeDataClick()" function,
    //without the nested values, it will complain about not having the nested elements included
    loadFakeDataPatchClick(): void {
        //console.log('inside loadFakeDataPatchClick()');
        this.reactiveFormGroup.patchValue({
            firstName: 'FakeFirstname',
            lastName: 'FakeLastName',
            userName: 'FakeUserName',
            email: 'fake@email.com',
            phone: '1234568',
            notes: 'fake notes',
            currentPassword: 'FakePassword',
            newPassword: 'FakeNewPassword'
        });
    }

    onSubmit(): void {
        console.log('inside ReactiveForm\'s onSubmit()');

        if (this.mapFormValuesToUsersModel()){
            //Do we care if it's a Register or an Update ???

            if(this.IsUpdate){
                this.userService.updateUser(this.authUser).subscribe(  //subscribe to the observable that returns void
                    //navigate the user to he list route once the update is complete
                    (newUser) => this.router.navigate(['/users/user', newUser.userName]),
                    (error: any)  => console.log('ERROR inside onSubmit Editing User: ' + JSON.stringify(error))
                );
            } else {
                console.log('ReactiveForm.onSubmit.registerUser with this.reactiveFormGroup.value.newPassword = ' + this.reactiveFormGroup.value.newPassword);
                this._auth.registerUser(this.authUser, this.reactiveFormGroup.value.newPassword)
                .subscribe(
                    (newUser) => {
                        console.log('newUser: ' + JSON.stringify(newUser));
                        console.log('user ' + newUser.userName + ' CREATED');
                        this.router.navigate(['/users/user', newUser.userName]);
                    },
                    (error: any)  => {
                        console.log('Changes not saved');
                        //TODO - create a message to the user about the error(s)
                        console.log('ERROR inside onSubmit Creating User: ' + JSON.stringify(error));
                    });
            }
        }
    }

    mapFormValuesToUsersModel(): boolean{
        //console.log('inside mapFormValuesToUsersModel(): ' + this.reactiveFormGroup.value.firstName + ' and ' + this.reactiveFormGroup.value.password);
        try{

            //TODO - REMEMBER to check if there are values for the required fields. Required fields are established in the API, so if you send this will empty data, a 400 may get returned from the API
            this.authUser.firstName = this.reactiveFormGroup.value.firstName;
            this.authUser.email = this.reactiveFormGroup.value.emailGroup.email;
            this.authUser.lastName = this.reactiveFormGroup.value.lastName;
            this.authUser.userName = this.reactiveFormGroup.value.userName;
            this.authUser.administeringUserEmail = this._auth.loggedInUser.email;
            this.authUser.notes = this.reactiveFormGroup.value.notes;
            this.authUser.password = this.reactiveFormGroup.value.currentPassword + '|' + this.reactiveFormGroup.value.newPassword;
            this.authUser.userType = { id: 2, name:''};//todo get the user type Whenever this is a REAL project
            
            console.log('Mapping reactiveFormGroup values: ' + JSON.stringify(this.reactiveFormGroup.value));
            console.log('Mapped authUser values: ' + JSON.stringify(this.authUser));
            return true;
            
        } catch (ex){
            console.log('ERROR inside mapFormValuesToUsersModel(): ' + ex);
            return false;
        }
    }

    //An example of looping through each control in the group. useful for Rest of controls, enable/disable form controls validation set/clears, mark dirty/touch/etc..
    logValidationErrors(group: UntypedFormGroup = this.reactiveFormGroup): void {   //use " = this.reactiveFormGroup" to set it as the default value. doing this makes us not have to specify a value for this parameter when we call it from the template 
        //retreive all the keys we have in the group, and just prints them out to the log (notice it does NOT log the nested group)
        //console.log(Object.keys(group.controls));

        //use a loop with a forEach
        Object.keys(group.controls).forEach((key: string) => {//get all the keys and loop over each key

            //the abstractControl variable can be, either, a FormControl or a NESTED FormGroup, so we need to check which it is
            const abstractControl = group.get(key); //get the reference to its associated control by using that key

            this.formErrors[key] = '';
            if (abstractControl) {
                if (!abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                    const messages = this.validationMessages[key];

                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            this.formErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }

            if (abstractControl instanceof UntypedFormGroup) {
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
        const group = this.reactiveFormGroup;
        Object.keys(group.controls).forEach((key: string) => {//use a loop with a forEach to get all the keys and loop over each key
            //the abstractControl variable can be, either, a FormControl or a NESTED FormGroup, so we need to check which it is
            const abstractControl = group.get(key); //get the reference to its associated control by using that key
            if (abstractControl instanceof UntypedFormGroup) {
                abstractControl.disable();  //this will disable the NESTED controls
            } else {
                //if it's not a nested form, it will mark it as dirty (not useful, but an example of being able to use other in-house techniques)
                abstractControl.markAsDirty();
            }
        });

    }

    //dynamically set and clear validators on specific controls
    onContactPreference_Changed(selectedValue: string) {
        console.log('Inside ReactiveFormComponent.onContactPreference_Changed with value: ' + selectedValue);
        const phoneControl = this.reactiveFormGroup.get('phone');
        if (selectedValue === 'phone') {
            if (Validators) {
                phoneControl.setValidators([Validators.required, Validators.minLength(5)]);
            }
        } else {
            phoneControl.clearValidators();
        }

        phoneControl.updateValueAndValidity();  //immediately triggers the validation. in this example, we want this for forcing the user to enter a phone
    }

    //dynamically set and clear validators on specific controls
    onUserType_Changed(selectedUserTypeValue: string) {
        console.log('Inside ReactiveFormComponent.onUserType_Changed with value: ' + selectedUserTypeValue);
        const userTypeControl = this.reactiveFormGroup.get('unassigned');
        if (selectedUserTypeValue === 'unassigned') {
            if (Validators) {
                userTypeControl.setValidators([Validators.required, Validators.minLength(5)]);
            }
        } else {
            userTypeControl.clearValidators();
        }

        userTypeControl.updateValueAndValidity();  //immediately triggers the validation. in this example, we want this for forcing the user to enter a phone
    }

    //dynamically add a dynamic formgrouping
    addDynamicFormGroup(): UntypedFormGroup {
        //console.log('addDynamicFormGroup - Adding a new Dynamic Group');
        return this.fb.group({
            dynamicNestedGroupName: ['', Validators.required],
            dynamicExperienceInYears: ['', Validators.required],
            dynamicProficiency: ['', Validators.required]
        })
    }

    addDynamicGroupButton_Click(): void {
        //console.log('addDynamicGroupButton_Click - ADDING a new Dynamic Group');
        (<UntypedFormArray>this.reactiveFormGroup.get('dynamicNestedGroup')).push(this.addDynamicFormGroup());   //need to type cast it into a FormArray to be able to use the 'push' method
    }

    removeDynamicGroup_click(index: number): void {
        //console.log('removeDynamicGroup_click - REMOVING an existing Dynamic Group');
        const userArray = (<UntypedFormArray>this.reactiveFormGroup.get('dynamicNestedGroup'));
        userArray.removeAt(index);
        userArray.markAsDirty();
        userArray.markAsTouched();
    }

    onUserDelete(): void {
        console.log('Inside onUserDelete' + JSON.stringify(this.user));
        this.userService.deleteUserById(this.user.userId).subscribe(  //subscribe to the observable that returns void
            //navigate the example to he list route once the update is complete
            () => this.router.navigate(['/users']),
            (error: any)  => console.log('ERROR inside onUserDelete example: ' + JSON.stringify(error))
            );
            console.log('Inside ReactiveFormComponent.onUserDelete() and "onUserDelete" method call is finished');
        }
        

    onUserResetCredentials(): void {
        console.log('Inside onUserResetCredentials: ' + JSON.stringify(this.user));
        this._auth.resetUserCredentialsById(this.user.userId).subscribe(  //subscribe to the observable that returns void
            //navigate the example to he list route once the update is complete
            isSuccess => {
                if(isSuccess){
                    console.log('onUserResetCredentials isSuccess: ' + isSuccess);
                }
            },
            error => {
                console.log('ERROR inside onUserResetCredentials example: ' + JSON.stringify(error))
            });
            console.log('Inside ReactiveFormComponent.onUserResetCredentials(), call is finished');
        }
}