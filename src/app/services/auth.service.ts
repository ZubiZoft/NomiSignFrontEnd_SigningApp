//angular imports
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
//rxjs imports
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthService {
    private rootURL: string = 'http://ogrean.com/nomisign/'

    constructor(private http: Http) {}

    loginUser(user): Observable<any> {
        let _headers = new Headers ({'Content-Type': 'application/json'})
        let options = new RequestOptions({method: 'POST', headers: _headers})
        let url = this.rootURL + 'api/login';
        let body = JSON.stringify(user)
        return this.http.post(url, body, options).map(response => response.json());
    }
}