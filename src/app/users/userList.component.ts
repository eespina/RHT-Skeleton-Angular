import { Component, OnInit } from '@angular/core';
import { IUser } from './user';
import { UserService } from './user.service';
import { UserSingletonService } from './userSingleton.service';

@Component({
    selector: 'list-user',
    templateUrl: './userList.component.html',
    styleUrls: ['./userList.component.css']
})
export class UserListComponent {
    users: IUser[];

    //list allows us to completely filter on the client side without having to go back to the server after filtering has alraedy been done.
        //Try using a getter/setter variable where the setter calls a new method that sets the 'filteredusers' list
        // (we're already filtering using a radio button for Total Users. This seems to be a different way that can be used with a search box, perhaps)
    filteredUsers: IUser[];

    selectedUserCountRadioButton: string = 'All';
    statusMessage: string = 'Loading Data. One Moment Please ...';
    showSpinner: boolean = true;    //currently NOT rotating, for some reason, at the moment

    constructor(private _userService: UserService, private _userSingletonService: UserSingletonService) { }

    get color(): string {
        return this._userSingletonService.colorPreference;
    }

    set color(value: string) {
        this._userSingletonService.colorPreference = value;
    }

    ngOnInit() {
        this._userService.getUsers()
            .subscribe((userList) => {
                console.log('userList.length = ' + userList.length)
                this.users = userList;
                this.filteredUsers = this.users;
                this.showSpinner = false;
            },
            (error) => {
                console.log('ERROR inside UserListComponent.ngOnInit.getUsers: ' + error.toString());
                this.statusMessage = 'Problem with the Service, Please Try Again Soon';
                this.showSpinner = false;
            });
    }

    getTotalUserCount(): number {
        return this.filteredUsers.length;
    }

    //Change these users to align with the actual data.. we're comparing username but theres not a proper match with the actual data
    getTotalUsersOneCount(): number {
        return this.filteredUsers.filter(e => e.userName === 'One').length;
    }

    //Change these users to align with the actual data.. we're comparing username but theres not a proper match with the actual data
    getTotalUsersLessThanOneCount(): number {
        return this.filteredUsers.filter(e => e.userName === 'Zero').length;
    }

    onUserCountRadioButtonChange(selectedRadioButtonValue: string): void {
        this.selectedUserCountRadioButton = selectedRadioButtonValue;
    }
}