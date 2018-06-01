import {Component, Input} from '@angular/core';
import {Headers, Http, RequestOptions, ResponseContentType} from '@angular/http';
import {CustomBrowserXhr} from '../services/custom-browser-xhr.service';
import * as FileSaver from 'file-saver';
import {environment} from '../../environments/environment';
import {SessionTimeoutDialogComponent} from './session-timeout-dialog/session-timeout-dialog.component';
import {MatDialog} from '@angular/material';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {AlertPrintComponent} from './contract-component/contract-component.component';
import {DocumentDetail} from '../models/documentDetail.model';

const rootURL: string = environment.serviceUrl;

@Component({
  selector: 'download-btn',
  template: '<button mat-raised-button color="primary" style=" width: 100%;" (click)="downloadFile()" [disabled]="disable"' +
  '                  i18n="action | button which will send a notification to the employees to sign the selected receipt.">' +
  '              Imprimir' +
  '          </button> ',
  providers: [
    {provide: CustomBrowserXhr, useClass: CustomBrowserXhr}
  ]
})

export class DownloadComponent {

  @Input() docs: DocumentDetail;
  @Input() disable: boolean;

  constructor(private http: Http, public dialog: MatDialog, private userService: UserService, private router: Router) {
  }

  public downloadFile() {
    let dialogRef = this.dialog.open(AlertPrintComponent, {
      width: '75%',
      data: { 'document': this.docs }
    });
    const user = this.userService.getUser();
    var _headers = new Headers({
      'Content-Type': 'application/json',
      'ClientType': 'nomisign',
      'Authorization': 'Basic ' + user.SessionToken
    });
    const url = rootURL + 'api/documents/DownloadPdf/' + this.docs.DocumentId;
    const options = new RequestOptions({method: 'GET', headers: _headers, responseType: ResponseContentType.Blob});
    return this.http.get(url, options)
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Acuerdo de Intercambio de Contraseñas.pdf';
          FileSaver.saveAs(blob, filename);
        }, error => {
          if (error.status === 405) {
            this.dialog.closeAll();
            let dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
              width: '75%'
            });
          } else {
            this.userService.clearUser();
            this.router.navigate(['/login']);
          }
        }
      );
  }
}
