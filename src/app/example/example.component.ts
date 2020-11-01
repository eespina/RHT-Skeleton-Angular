﻿import { Component, OnInit } from '@angular/core';
import { IExample } from './example';
import { ActivatedRoute, Router } from '@angular/router';
import { ExampleService } from './example.service';
// import 'rxjs/operator/retrywhen';
// import 'rxjs/operator/delay';    //specifies the delay in mlliseconds when using retry
// import 'rxjs/operator/scan';    //used for customizing the retry process
import 'rxjs';
import { Subscription } from 'rxjs';

@Component({
    selector: 'example-detail',
    templateUrl: './example.component.html'//, styleUrls: ['example.component.css']
})
export class ExampleComponent implements OnInit {
    example: IExample;
    statusMessage: string = 'Loading Data, Please Wait ...';
    subscription: Subscription;

    constructor(private _exampleService: ExampleService, private _activatedRoute: ActivatedRoute, private _router: Router) {
    }

    onBackButtonClick(): void {
        this._router.navigate(['/examples']);

        ////Example using Relative Path
        //this._router.navigate(['examples'], { relativeTo; this.route });

        ////Example using Query Params
        //this._router.navigate(
        //    ['/examples'],
        //    { queryParams: { filterBy: 'filter', showImage: true } }
        //);

        ////using outlets for SECONDARY outlets
        //this._router.navigate([{ outlets: { secondaryExampleRouterOutlet: ['Another-Link-Parameters-Array-specifying-secondary-path'] } }]);
        ////CLEAR the outlet for SECONDARY outlets
        //this._router.navigate([{ outlets: { secondaryExampleRouterOutlet: ['null'] } }]);
    }

    onCancelButtonClick(): void {
        this.statusMessage = 'Request Cancelled'
        this.subscription.unsubscribe();
    }

    onEditButtonClick(userName: string): void {
        console.log(`inside onEditButtonClick() with ${userName} as the parameter'd ID`);
        this._router.navigate(['/reactiveForm', userName]); // "userName", which is the parameter value, MUST match the reactiveForm's 'params.get('userName');' syntax
    }

    ngOnInit() {
        this._activatedRoute.paramMap.subscribe(
            params => {
                let exCode = params.get('userName');    //TODO - MAY want to switch this 'userName' parameter to use an #ID instead. It's just more conventional
                //let qp = this._activatedRoute.snapshot.queryParams['filterBy'] || ''; //OPTIONAL query parameter receiving, use this to BIND a local variable that is used in the HTML

                //may want to create ANOTHER method to seperate this logic from this .ts file
                this.subscription = this._exampleService.getExampleById(exCode)
                    // .retryWhen((err) => {    //JUST NOT WORKING RIGHT NOW (WITH THE UPGRADE ABOVE 6.0.0+)    TODO - probably fix this
                    //     return err.scan((retryCount) => {
                    //         retryCount += 1;
                    //         if (retryCount < 5) {
                    //             this.statusMessage = 'Retrying ..... #' + retryCount;
                    //             return retryCount;
                    //         } else {
                    //             throw (err);
                    //         }
                    //     }, 0).delay(1000)   //delay to be able to retry in a moment, after the previous one failed
                    // })
                    .subscribe(
                    (exData) => {
                        if (exData == null) {
                            this.statusMessage = 'Example Does NOT Exist';
                        } else {
                            this.example = exData;
                            console.log(`RECEIVED exDATA of example ${exData.userName} in Obesrvable-Params version`);
                        }
                    },
                    (error) => {
                        this.statusMessage = 'Problem with the Service. Please Retry after some time ... ';
                        console.log(error);
                    }
                    );
            }
        );
    }
}