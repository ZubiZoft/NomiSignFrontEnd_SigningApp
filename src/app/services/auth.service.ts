import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {environment} from '../../environments/environment';
import {EmployeeModel} from '../models/employee.model';
import {Answers} from '../models/Answers';

const rootURL: string = environment.serviceUrl;

@Injectable()
export class AuthService {
  constructor(private http: Http) {
  }

  loginUser(user): Observable<any> {
    let _headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({method: 'POST', headers: _headers});
    let url = rootURL + 'api/login';
    let body = JSON.stringify(user);
    return this.http.post(url, body, options).map(response => response.json());
  }

  sendPasswordReset(user0: Answers): Observable<any> {
    let _headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({method: 'POST', headers: _headers});
    let url = rootURL + 'api/login/reset';

    let temp = JSON.stringify(user0);
    let user: Answers = JSON.parse(temp);

    user.Q1 = null;
    user.Q2 = null;
    user.Q3 = null;

    let body = JSON.stringify(user);

    return this.http.post(url, body, options).map(response => response.json());
  }

  sendPasswordResetByEmail(user0: Answers): Observable<any> {
    let _headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({method: 'POST', headers: _headers});
    let url = rootURL + 'api/resetByEmail';

    let temp = JSON.stringify(user0);
    let user: Answers = JSON.parse(temp);

    user.Q1 = null;
    user.Q2 = null;
    user.Q3 = null;

    let body = JSON.stringify(user);

    return this.http.post(url, body, options).map(response => response.json());
  }

  getQuestions(account): Observable<any> {
    let _headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({method: 'POST', headers: _headers});
    let url = rootURL + 'api/securityQuestionsForgot/';
    let emp: EmployeeModel = new EmployeeModel();
    emp.EmailAddress = account;
    let body = JSON.stringify(emp);
    return this.http.post(url, body, options).map(response => response.json());
  }
}
