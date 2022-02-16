import { Component, OnInit } from '@angular/core';
import { IExample } from './example';
import { ExampleService } from './example.service';
import { ExampleSingletonService } from './exampleSingleton.service';

@Component({
    selector: 'list-example',
    templateUrl: './exampleList.component.html',
    styleUrls: ['./exampleList.component.css']
})
export class ExampleListComponent {
    examples: IExample[];

    //list allows us to completely filter on the client side without having to go back to the server after filtering has alraedy been done.
        //Try using a getter/setter variable where the setter calls a new method that sets the 'filteredexample' list
        // (we're already filtering using a radio button for Total examples. This seems to be a different way that can be used with a search box, perhaps)
    filteredExamples: IExample[];

    selectedExampleCountRadioButton: string = 'All';
    statusMessage: string = 'Loading Example Data. One Moment Please ...';
    showSpinner: boolean = true;    //currently NOT rotating, for some reason, at the moment

    constructor(private _exampleService: ExampleService, private _exampleSingletonService: ExampleSingletonService) { }

    get color(): string {
        return this._exampleSingletonService.colorPreference;
    }

    set color(value: string) {
        this._exampleSingletonService.colorPreference = value;
    }

    ngOnInit() {
        // console.log('Initiating ExampleListComponent')
        this._exampleService.getExamples()
            .subscribe((exampleList) => {
                if(!exampleList)
                {
                    console.log('exampleList is NULL')
                    this.statusMessage = 'There apparently are no Examples to show at this time. If you feel there should be Examples displayed, purple monkey dishwasher.';
                    this.showSpinner = false;
                }
                else if(!exampleList.length)
                {
                    console.log('exampleList.length is NULL.')
                } else {
                    // console.log('exampleList.length = ' + exampleList.length)
                }
                this.examples = exampleList;
                this.filteredExamples = this.examples;
                this.showSpinner = false;
            },
            (error) => {
                this.statusMessage = 'Problem with the Service, Please Try Again Soon';
                this.showSpinner = false;
            });
    }

    getTotalExampleCount(): number {
        return this.filteredExamples.length;
    }

    //Change these examples to align with the actual data.. we're comparing example but theres not a proper match with the actual data
    getTotalExamplesOneCount(): number {
        return this.filteredExamples.filter(e => e.exampleCharacteristic === 'One').length;
    }

    //Change these examples to align with the actual data.. we're comparing example but theres not a proper match with the actual data
    getTotalExamplesLessThanOneCount(): number {
        return this.filteredExamples.filter(e => e.exampleCharacteristic === 'Zero').length;
    }

    onExampleCountRadioButtonChange(selectedRadioButtonValue: string): void {
        this.selectedExampleCountRadioButton = selectedRadioButtonValue;
    }
}