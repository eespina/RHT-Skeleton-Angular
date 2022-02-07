import { IUserArray } from './userArray';

export interface IUser { //we've mixed IUser and IUser (angular). Should NOT be an issue creating new POCO/POJO entities in the future
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    createDate: Date;
    isActive: Boolean;
    //password: string;//this SHOULD no longer be needed in any manner since we're using request headers at the moment
    userArray: IUserArray[];
    currentAdministeringUser
    notes: string;
    userType: IUserType;
    administeringUserEmail: string;
    tokenHandleViewModel: ITokenInfo;

	nullUserProperty?: string;   //This exists to show an example of possible null information (does NOT exist)
}

export interface IUserType {
    id: number;
    name: string;
}

export interface ITokenInfo {
    token: string;
    expiration: Date;
}

export interface ILoginInfo {
    userName: string;
    password: string;
}

//export class User implements IUser {
//    getUserNumber(userNumber: number): number {
//        return this.userNumber;
//    }
//    constructor(public userId: number, public userString: string, public userNumber: number) { }
//}