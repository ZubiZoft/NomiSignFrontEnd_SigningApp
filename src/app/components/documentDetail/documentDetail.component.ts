import {Component, OnInit, SecurityContext} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/switchMap';
import {DocumentService} from '../../services/documents.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {DocumentDetail} from '../../models/documentDetail.model';

@Component({
  selector: 'app-document-detail',
  templateUrl: './documentDetail.component.html',
  styleUrls: ['./documentDetail.component.css'],
})
export class DocumentDetailComponent implements OnInit {
  isPromiseDone = false;
  user: User;
  document: DocumentDetail;
  isUnsigned = false;

  constructor(private documentService: DocumentService, private userService: UserService, private route: ActivatedRoute,
              private sanitizer: DomSanitizer, public snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    console.log(this.isPromiseDone);
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

  refuseDocument() {
    var reason = prompt('Please enter your refused reason', '');
    this.document.EmployeeConcern = reason;
    this.document.SignStatus = 3;
    this.documentService.updateDocument(this.user.EmployeeId, this.document).subscribe(data => {
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

@Component({
  selector: 'document-sign-notice',
  template: `
    <div i18n="notice | alert notifying the user they signed the document@@DocumentSignedNotice"> Document was signed</div>`
})
export class DocumentSignedNoticeComponent {
}

@Component({
  selector: 'document-reject-notice',
  template: `
    <div i18n="notice | alert notifying the user they rejected the document@@DocumentRejectedNotice"> Document was rejected</div>`
})
export class DocumentRejectNoticeComponent {
}
