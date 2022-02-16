//we've mixed IUser and IUser (angular). Should NOT be an issue creating new POCO/POJO entities in the future
export interface IAuthUser {    //DO NOT use these for both User and a person (authUser.ts stuff), for this is too much together
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;   //TODO - for UPDATE's, switch this to use HEADER info instead
    userType: IUserType;
    CurrentAdministeringUser: string;
    administeringUserEmail: string;
    tokenHandleViewModel: ITokenInfo;

    // isAdmin: boolean;
    isActive: boolean;
    isChangingCredentials: boolean;
    notes: string;
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

//    //    getUserUser(userUser: User): string {
//    //        return this.userUser;
//    //    }
//    //constructor(public id: number, public username: string, public email: string) { }
//}
