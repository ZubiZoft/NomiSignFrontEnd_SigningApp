import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {EmployeeModel} from '../models/employee.model';
import {User} from '../models/user.model';

import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {UserService} from './user.service';

const rootURL: string = environment.serviceUrl;

@Injectable()
export class EmployeeService {

  constructor(private http: Http, private userService: UserService) { }

  //GET/:cid/:eid
  getEmployeeById(employeeId: string): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    return this.http.get(rootURL + 'api/employee/' + employeeId, {headers: _headers}).map(response => response.json());
  }

  //GET/:cid/:eid
  employeeByIdExixts(employeeId: string): Observable<any> {
    var _headers = new Headers({});
    return this.http.get(rootURL + 'api/employeeexist/' + employeeId, {headers: _headers}).map(response => response.json());
  }

  //PUT
  updateEmployeeDetails(employeeId: string, employee: EmployeeModel): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    var options = new RequestOptions({method: 'PUT', headers: _headers});
    var body = JSON.stringify(employee);
    var url = rootURL + 'api/employees/' + employeeId;
    return this.http.put(url, body, options).map(response => response.json());
  }

  updateEmployeePhone(employeeId: string, employee: EmployeeModel): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    var options = new RequestOptions({method: 'PUT', headers: _headers});
    employee.CellPhoneNumber = employee.CellPhoneNumber;
    var body = JSON.stringify(employee);
    var url = rootURL + 'api/employees/phone/' + employeeId;
    return this.http.put(url, body, options).map(response => response.json());
  }

  //PUT
  updateEmployeePassword(employeeId: string, employee: EmployeeModel): Observable<any> {
    var _headers = new Headers({'Content-Type': 'application/json'});
    var options = new RequestOptions({method: 'PUT', headers: _headers});
    var body = JSON.stringify(employee);
    var url = rootURL + 'api/employees/password/' + employeeId;
    return this.http.put(url, body, options).map(response => response.json());
  }

  //PUT
  updateEmployeePasswordSession(employeeId: string, employee: EmployeeModel): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    var options = new RequestOptions({method: 'PUT', headers: _headers});
    var body = JSON.stringify(employee);
    var url = rootURL + 'api/employees/passwordsession/' + employeeId;
    return this.http.put(url, body, options).map(response => response.json());
  }

  looksForContracts(employee: EmployeeModel): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    var options = new RequestOptions({method: 'POST', headers: _headers});
    var body = JSON.stringify(employee);
    var url = rootURL + 'api/contracts';
    return this.http.post(url, body, options).map(response => response.json());
  }
}
