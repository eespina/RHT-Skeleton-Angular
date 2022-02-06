import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IExample } from './example';
// import { Http } from '@angular/http'; //import { Http, Response } from '@angular/http'; (NOT using Response here, it's been moved to the AuthService)
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
// import 'rxjs/operator/map';
// import 'rxjs/operator/catch';
// import 'rxjs/observable/throw';
import { IAuthUser } from '../auth/authUser';
import 'rxjs';
import { catchError, tap } from 'rxjs/operators';
//import 'rxjs/add/Observable/of';    //perhaps ANOTHER way of doing a get from somewhere (probably from in-memory data)
//import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';   //TODO - figure out how to use ALL environments. WHY can't I use it in a generic manner now??

@Injectable()
export class ExampleService {

    constructor(private _http: HttpClient, private _router: Router, private _auth: AuthService) { }

    getExamples(): Observable<IExample[]> {
        // console.log('Getting Examples');
        //var examples = this._http.get<IExample[]>('http://localhost:53465/api/example').delay(4130)    //can ALSO use this as an alternative (includes the '<IExample[]>' as the type returned from the observable)
        var examples = this._http.get<IExample[]>(environment.baseUrl + 'example/').pipe(catchError(error => this._auth.handleError(error)));

        // console.log('Examples Finished');
        return examples;
    }

    getExampleById(exampleId: string): Observable<IExample> {
        if(!exampleId || exampleId === ""){
            console.log('Example parameter is NOT properly passed');
        }
        var link = environment.baseUrl + 'example/' + exampleId;
        // console.log('Getting Individual Example from ' + link);
        var example = this._http.get<IExample>(link)   //string literal examples
        //.map((response: Response) => <IExample>response.json())
        //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>. You no longer need to call the '.map' function above yourself.

        //UPDATED the older way to 'catch'... previously was "  .catch(error => this._auth.handleError(error));    ". NOT sure this applies for " .map" function, but seems to work
        .pipe(catchError(error => this._auth.handleError(error)));

        // console.log('Finshed Getting Individual Example');
        return example;
    }

    //this currently does nothing, it just returns mocked data back from the server
    updateExample(example: IExample): Observable<IExample> {//todo, turn this into a update for Examples rahter than the iAUTH users
        console.log('Inside ExampleService.updateExample()');
        console.log('inside updateExample(), example:' + JSON.stringify(example));
        if (example) {
            console.log('inside ExampleService.updateExample() and "example" object is NOT empty or undefined/null');
            // this._auth.encryptUsingAES256(password, false);
            // const httpOptions = {
            //     headers: new HttpHeaders(
            //         {
            //             'Content-Type': 'application/json',
            //             'old-password': this._auth.encryptedPassword.toString(),
            //             'new-password': this._auth.encryptedPassword.toString()
            //         })
            // };
            
            var updatedExamples = this._http.put<IExample>(environment.baseUrl + 'example/', example)
            .pipe(
                tap((newExample: IExample) => console.log(`added new example with exampleId = ${newExample.exampleId}`)),
                catchError(error => this._auth.handleError(error))
              );            

            console.log('LEAVING updateExample()');

            return updatedExamples;

        } else {
            let errMsg = 'The Example is not useable or undefined/null';
            throwError(errMsg);
        }
    }

    createExample(creatingExample): Observable<IExample> {
        
        // //NOT tested, let's hope this works
        // this.encryptUsingAES256(formPassword, false);
        // let headers = new HttpHeaders();
        // headers = headers.append('password', formPassword.toString());

        let exampleCreationResponse = this._http.post<IExample>(environment.baseUrl + 'example/', creatingExample)
            //.map((response: Response) => <IUser>response.json())  //HttpClient.get() applies res.json() automatically and returns Observable<HttpResponse<string>>.
            //You no longer need to call the '.map' function above yourself.
            .pipe(catchError(error => this.handleError(error)));  //UPDATED the older way to 'catch'... previously was "  .catch(error => this.handleError(error));
        // this.loggedInUser = creatingExample;
        return exampleCreationResponse;
    }

    deleteExampleById(exampleId: string): Observable<boolean> {
        if(!exampleId || exampleId === ""){
            console.log('Example parameter is NOT properly passed. no deletion occurred');
        }
        var link = environment.baseUrl + 'example/' + exampleId;
        let isDeleted = this._http.delete<boolean>(link).pipe(catchError(error => this._auth.handleError(error)));

        console.log('Finshed deleteExampleById');
        return isDeleted;
    }

    handleError(error: HttpErrorResponse) {
        console.error(error);
        if (error && error.status == 401) {
            this._auth.logoutUserLocal(true);
        }

        return throwError(error);
    }
}