//angular imports
import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
//rxjs imports
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {environment} from '../../environments/environment';
import {UserService} from './user.service';

//const rootURL: string = 'http://ogrean.com/nomisign/'
const rootURL: string = environment.serviceUrl;

@Injectable()
export class DocumentService {
  //private rootURL: string = 'http://ogrean.com/nomisign/'

  constructor(private http: Http, private userService: UserService) {
  }

  getDocumentsForUser(userId): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      //'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    let options = new RequestOptions({method: 'GET', headers: _headers});
    let url = rootURL + 'api/documents/' + userId;

    return this.http.get(url, options).map(response => response.json());
  }

  getUserDocumentData(documentId): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    let options = new RequestOptions({method: 'GET', headers: _headers});
    let url = rootURL + 'api/documentsEmployee/' + documentId;

    return this.http.get(url, options).map(response => response.json());
  }

  updateDocument(userId, document): Observable<any> {
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    let options = new RequestOptions({method: 'PUT', headers: _headers});
    let url = rootURL + 'api/documents/' + document.DocumentId;
    let body = JSON.stringify(document);

    return this.http.put(url, body, options).map(response => response.json());
  }
}
