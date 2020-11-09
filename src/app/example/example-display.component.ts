import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExample } from './example';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'list-display-example',
    templateUrl: './example-display.component.html',
    styleUrls: ['./example-display.component.css']
})
export class ExampleDisplayComponent implements OnInit, OnChanges {
    @Input() exampleId: number;
    @Input() example: IExample;   //use the @Input attribute to let the parent class/componenet pass information into 
    constructor(private _router: Router, private route: ActivatedRoute) { }
    ngOnInit() { }

    //NOT implemented, because we're not switching examples. The example I'm following uses an individual example instead of a list. The below still gets logged on component_load
    ngOnChanges(changes: SimpleChanges) {   //automatcially called whenever any of the @Input properties change
        //Demonstrates 'ngOnChanges' way of reacting to a detection change from the Parent to the Child component
        for (var p of Object.keys(changes)) {
            var change = changes[p];
            var from = JSON.stringify(change.previousValue);
            var to = JSON.stringify(change.currentValue);
            console.log('changes from ' + from + ' to ' + to + '.');    //TODO - Get rid of this console logging.
        }
    }
    
    //this is a crappy on-click technique being used because of the Lazy Loading of the examply.module.ts's class does not enable the bind-ability
    //  of the [routerLink] property without the "AppRoutingModule" inside the example.module.ts being enabled. when it is enable, as it was before,
    //  it errors the application due to multiple loading's of the "AppRoutingModule" module.
    //  Not every module that is to be lazy loaded should have to put up with that.
    onExample_click(userNameToPassAsParameter) {
        console.log('inside onExample_click');
        this._router.navigate(['/examples/example', userNameToPassAsParameter]);
    }
}
