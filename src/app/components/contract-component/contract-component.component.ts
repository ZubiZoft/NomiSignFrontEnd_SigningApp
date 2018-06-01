import {Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {DocumentDetail} from '../../models/documentDetail.model';
import {User} from '../../models/user.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {DocumentService} from '../../services/documents.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DocumentRejectNoticeComponent, DocumentSignedNoticeComponent} from '../documentDetail/documentDetail.component';
import {SessionTimeoutDialogComponent} from '../session-timeout-dialog/session-timeout-dialog.component';


@Component({
  selector: 'app-contract-component',
  templateUrl: './contract-component.component.html',
  styleUrls: ['./contract-component.component.css']
})
export class ContractComponentComponent implements OnInit, AfterViewInit {

  isPromiseDone = false;
  user: User;
  document: DocumentDetail;
  isUnsigned = false;

  @ViewChild('PdfMainViewer') iframe: ElementRef;

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

  ngAfterViewInit() {
  }

  signDocument() {
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
  selector: 'alert-print-component',
  templateUrl: 'alert-print-component.html'
})
export class AlertPrintComponent implements OnInit {

  document: DocumentDetail;

  constructor(public dialogRef: MatDialogRef<AlertPrintComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private documentService: DocumentService, private router: Router, public dialog: MatDialog,
              private userService: UserService) {
  }

  ngOnInit() {
    this.document = this.data['document'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  printed(): void {
    this.document.SignStatus = 2;
    this.documentService.updateDocument(0, this.document).subscribe(
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
