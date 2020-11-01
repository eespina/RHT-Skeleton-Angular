import { IExampleArray } from './exampleArray';

export interface IExample {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    createDate: Date;
    isActive: Boolean;
    password: string;
    exampleArray: IExampleArray[];
	nullExampleProperty?: string;   //This exists to show an example of possible null information (does NOT exist)

    //exampleId: number;
    //exampleString: string;
    //exampleNumber: number;
    //optionalExampleProperty?: string;

    ////getExampleNumber(exampleNumber: number): number;
}

//export class Example implements IExample {
//    getExampleNumber(exampleNumber: number): number {
//        return this.exampleNumber;
//    }
//    constructor(public exampleId: number, public exampleString: string, public exampleNumber: number) { }
//}