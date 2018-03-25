import { Component, OnInit } from '@angular/core';
import {DocumentDetail} from '../../models/documentDetail.model';
import {User} from '../../models/user.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {DocumentService} from '../../services/documents.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DocumentRejectNoticeComponent, DocumentSignedNoticeComponent} from '../documentDetail/documentDetail.component';
import {PasswordAlertDialog} from '../account/account.component';
import {SessionTimeoutDialogComponent} from '../session-timeout-dialog/session-timeout-dialog.component';

@Component({
  selector: 'app-contract-component',
  templateUrl: './contract-component.component.html',
  styleUrls: ['./contract-component.component.css']
})
export class ContractComponentComponent implements OnInit {

  isPromiseDone = false;
  user: User;
  document: DocumentDetail;
  isUnsigned = false;

  constructor(public dialog: MatDialog, private userService: UserService, private router: Router,
              private sanitizer: DomSanitizer, public snackBar: MatSnackBar, private _location: Location,
              private documentService: DocumentService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.route.paramMap
      .switchMap((params: ParamMap) => this.documentService.getUserDocumentData(params.get('id')))
      .subscribe(data => {
        this.document = data;
        this.isPromiseDone = true;
        this.isUnsigned = (this.document.SignStatus === 1);
      }, error => {
        if (error.status === 405) {
          let dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
            width: '75%'
          });
        } else {
          this.userService.clearUser();
          this.router.navigate(['/login']);
        }
      });
  }

  signDocument() {
    this.document.SignStatus = 2;
    this.documentService.updateDocument(this.user.EmployeeId, this.document).subscribe(
      data => {
        this.openDocumentNotice(this.document.SignStatus);
        this._location.back();
      }, error => {
        if (error.status === 405) {
          let dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
            width: '75%'
          });
        } else {
          this.userService.clearUser();
          this.router.navigate(['/login']);
        }
      });
  }

  openDocumentNotice(docSignStatus) {
    if (docSignStatus === 2) {
      this.snackBar.openFromComponent(DocumentSignedNoticeComponent, {duration: 3000});
    }
    if (docSignStatus === 3) {
      this.snackBar.openFromComponent(DocumentRejectNoticeComponent, {duration: 3000});
    }
  }
}
