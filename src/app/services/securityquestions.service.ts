import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import { EmployeeSecurityQuestionsModel } from '../models/securityquestions.model'

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

const rootURL: string = environment.serviceUrl;

@Injectable()
export class SecurityQuestionService {

    constructor(private http: Http) { }
   
    //GET/:cid
    getEmployeeSecurityQuestions(employeeId: string): Observable<any> {
        var _headers = new Headers({})
        return this.http.get(rootURL + 'api/securityquestions/' + employeeId, { headers: _headers }).map(response => response.json());
    }

    //PUT
    updateEmployeeSecurityQuestions(employeeId: string, securityQuestions: EmployeeSecurityQuestionsModel): Observable<any> {
        var _headers = new Headers({ 'Content-Type': 'application/json' })
        var options = new RequestOptions({ method: 'PUT', headers: _headers })
        var body = JSON.stringify(securityQuestions);
        var url = rootURL + 'api/securityquestions/' + employeeId
        return this.http.put(url, body, options).map(response => response.json());
    }
    //POST
    saveNewEmployeeSecurityQuestions(securityQuestions: EmployeeSecurityQuestionsModel): Observable<any> {
        var _headers = new Headers({ 'Content-Type': 'application/json' })
        var options = new RequestOptions({ method: 'POST', headers: _headers })
        var body = JSON.stringify(securityQuestions);
        console.log(securityQuestions)
        var url = rootURL + 'api/securityquestions'
        return this.http.post(url, body, options).map(response => response.json());
    }
}