import { Component, OnInit } from '@angular/core';
import {DocumentDetail} from '../../models/documentDetail.model';
import {User} from '../../models/user.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {UserService} from '../../services/user.service';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {DocumentService} from '../../services/documents.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DocumentRejectNoticeComponent, DocumentSignedNoticeComponent} from '../documentDetail/documentDetail.component';

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

  constructor(private documentService: DocumentService, private userService: UserService, private route: ActivatedRoute,
              private sanitizer: DomSanitizer, public snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.route.paramMap
      .switchMap((params: ParamMap) => this.documentService.getUserDocumentData(this.user.EmployeeId, params.get('id')))
      .subscribe(data => {
        this.document = data;
        this.isPromiseDone = true;
        this.isUnsigned = (this.document.SignStatus === 1);
      });
  }

  signDocument() {
    this.document.SignStatus = 2;
    this.documentService.updateDocument(this.user.EmployeeId, this.document).subscribe(
      data => {
        this.openDocumentNotice(this.document.SignStatus);
        this._location.back();
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
