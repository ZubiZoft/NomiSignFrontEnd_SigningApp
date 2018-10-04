import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserService} from '../services/user.service';
import {environment} from '../../environments/environment';

const rootURL: string = environment.serviceUrl;

@Injectable()
export class SettingsService {

  constructor(private http: Http, private userService: UserService) {
  }

  getSystemSettings(): Observable<any> {
    let _headers = new Headers({});
    let options = new RequestOptions({method: 'GET', headers: _headers});
    let url = rootURL + 'api/systemsettings';

    return this.http.get(url, options).map(response => response.json());
  }

  getCompanyLogo(companyId): Observable<any> {
    const user = this.userService.getUser();
    const _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    const options = new RequestOptions({method: 'GET', headers: _headers});
    const url = rootURL + 'api/companies/' + companyId + '/logo';
    return this.http.get(url, options).map(response => response.json());
  }
}
