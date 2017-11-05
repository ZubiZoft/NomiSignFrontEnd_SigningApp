//angular imports
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
//rxjs imports
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SettingsService {
    private rootURL: string = 'http://ogrean.com/nomisign/'

    constructor(private http: Http) {}

    getSystemSettings(): Observable<any> {
        let _headers = new Headers ({ })
        let options = new RequestOptions({method: 'GET', headers: _headers})
        let url = this.rootURL + 'api/systemsettings';

        return this.http.get(url, options).map(response => response.json());
    }
}