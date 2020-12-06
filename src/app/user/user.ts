//we've mixed IUser and IExample (angular). Should NOT be an issue creating new POCO/POJO entities in the future
export interface IUser {    //DO NOT use these for both User and a person (example.ts stuff), for this is too much together
    // userId: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;   //TODO - for UPDATE's, switch this to use HEADER info instead
    userType: IUserType;
    // CurrentAdministeringUser: string;
    administeringUserEmail: string;
    tokenHandleViewModel: ITokenInfo;

    // isAdmin: boolean;
    isActive: boolean;

}

export interface IUserType {
    id: number;
    name: string;
}

export interface ITokenInfo {
    token: string;
    expiration: Date;
}

//export class User implements IUser {
//    id: number;
//    username: string;
//    email: string;
//    isAdmin: boolean;
//    token: string;
//    password: string;

//    firstName: string;
//    lastName: string;
//    createDate: Date;
//    isActive: Boolean;

//    //    getExampleUser(exampleUser: User): string {
//    //        return this.exampleUser;
//    //    }
//    //constructor(public id: number, public username: string, public email: string) { }
//}
