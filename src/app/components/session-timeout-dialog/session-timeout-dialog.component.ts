import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AppSettings} from '../../app.settings';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-session-timeout-dialog',
  templateUrl: './session-timeout-dialog.component.html',
  styleUrls: ['./session-timeout-dialog.component.css']
})
export class SessionTimeoutDialogComponent implements OnInit, OnDestroy {

  timeout: number;

  constructor(public dialogRef: MatDialogRef<SessionTimeoutDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.timeout = AppSettings.SESSION_TIMEOUT;
  }

  ngOnDestroy() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
