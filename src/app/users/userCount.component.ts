import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'user-count',
    templateUrl: './userCount.component.html',
    styleUrls: ['./userCount.component.css']
})
export class UserCountComponent {

    selectedRadioButtonValue: string = 'All';

    @Output()   //A child component uses an event to pass data to the parent component, here we're passing a string to the Parent component (userList.component.ts)
    countRadioButtonSelectionChanged: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    all: number;

    @Input()
    justOne: number;

    @Input()
    lessThanOne: number;

    onRadioButtonSelectionChanged() {
        this.countRadioButtonSelectionChanged.emit(this.selectedRadioButtonValue);
    }
}