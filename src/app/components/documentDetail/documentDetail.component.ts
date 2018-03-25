import {Component, Inject, OnInit, SecurityContext, LOCALE_ID} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/switchMap';
import {DocumentService} from '../../services/documents.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {DocumentDetail} from '../../models/documentDetail.model';
import {FormControl, Validators} from '@angular/forms';
import {SessionTimeoutDialogComponent} from '../session-timeout-dialog/session-timeout-dialog.component';

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

  constructor(private documentService: DocumentService, private route: ActivatedRoute, private sanitizer: DomSanitizer,
              public snackBar: MatSnackBar, private _location: Location, public dialog: MatDialog, private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.route.paramMap
      .switchMap((params: ParamMap) => this.documentService.getUserDocumentData(params.get('id')))
      .subscribe(data => {
        this.document = data;
        this.isPromiseDone = true;
        this.isUnsigned = (this.document.SignStatus !== 2);
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

  signDocumentConfirm() {
    this.document.SignStatus = 2;
    let dd = new Date(this.document.PayperiodDate);
    let dialogRef = this.dialog.open(SignatureConfirmDialogComponent, {
      width: '75%',
      data: {
        'period': dd.toLocaleDateString('es-MX'),
        'employeeId': this.user.EmployeeId,
        'document': this.document
      }
    });
  }

  refuseDocument() {
    let dialogRef = this.dialog.open(RejectReasonDialogComponent, {
      width: '75%',
      data: {
        'employeeId': this.user.EmployeeId,
        'document': this.document
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

  showNomCert() {
    let dialogRef = this.dialog.open(Nom151DialogComponent, {
      width: '75%',
      data: {'message': this.document.NomCert}
    });
  }
}

@Component({
  selector: 'document-sign-notice',
  template: `
    <div i18n="notice | alert notifying the user they signed the document@@DocumentSignedNotice">El documento fue firmado</div>`
})
export class DocumentSignedNoticeComponent {
}

@Component({
  selector: 'document-reject-notice',
  template: `
    <div i18n="notice | alert notifying the user they rejected the document@@DocumentRejectedNotice">El documento fue rechazado</div>`
})
export class DocumentRejectNoticeComponent {
}

@Component({
  selector: 'nom-151-dialog-component',
  templateUrl: 'nom-151-dialog-component.html',
})
export class Nom151DialogComponent implements OnInit {

  nomCert: string;

  constructor(public dialogRef: MatDialogRef<Nom151DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.nomCert = this.data['message'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'signature-confirm-dialog-component',
  templateUrl: 'signature-confirm-dialog-component.html',
})
export class SignatureConfirmDialogComponent implements OnInit {

  period: string;
  document: DocumentDetail;
  employeeId: number;

  constructor(public dialogRef: MatDialogRef<SignatureConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              public documentService: DocumentService, public dialog: MatDialog, private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.period = this.data['period'];
    this.document = this.data['document'];
    this.employeeId = this.data['employeeId'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  signDocument() {
    this.documentService.updateDocument(this.employeeId, this.document).subscribe(
      data => {
        this.router.navigateByUrl('/documents');
        this.dialogRef.close();
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
      });
  }
}

@Component({
  selector: 'reject-reason-dialog-component',
  templateUrl: 'reject-reason-dialog-component.html',
})
export class RejectReasonDialogComponent implements OnInit {

  document: DocumentDetail;
  employeeId: number;
  reason: string;
  reasonField = new FormControl('', [
    Validators.required,
    Validators.maxLength(250),
  ]);

  constructor(public dialogRef: MatDialogRef<RejectReasonDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              public documentService: DocumentService, public dialog: MatDialog, private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.document = this.data['document'];
    this.employeeId = this.data['employeeId'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  rejectDocument() {
    this.document.SignStatus = 3;
    this.document.EmployeeConcern = this.reason;
    this.documentService.updateDocument(this.employeeId, this.document).subscribe(data => {
      this.router.navigateByUrl('/documents');
      this.dialogRef.close();
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
    });
  }
}

