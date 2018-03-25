import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeModel} from '../../models/employee.model';
import {MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SessionTimeoutDialogComponent} from '../session-timeout-dialog/session-timeout-dialog.component';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'ng-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [EmployeeService]
})
export class ChangePasswordComponent implements OnInit {
  constructor(private _location: Location, private route: ActivatedRoute, public snackbar: MatSnackBar,
              private employeeService: EmployeeService, private _formBuilder: FormBuilder, public dialog: MatDialog,
              private userService: UserService, private router: Router) {
  }

  employee: EmployeeModel;
  employeePasswordDetails: EmployeeModel;
  isPromiseDone: boolean = false;
  usernameFormControl = new FormControl('', [
    Validators.email]);
  oldPasswordFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  passwordVerifyFormControl = new FormControl('', [Validators.required, Validators.pattern('')]);

  ngOnInit(): void {
    this.employeePasswordDetails = new EmployeeModel();

    this.route.paramMap
      .switchMap((params: ParamMap) => this.employeeService.getEmployeeById(params.get('uid')))
      .subscribe(data => {
        this.employee = data;
        this.isPromiseDone = true;
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

  reroute(activeUser) {
    // will need phone later maybe  this.employeePasswordDetails.EmailAddress === this.employee.EmailAddress &&
    if ((!this.passwordVerifyFormControl.hasError('pattern'))) {
      this.employee.PasswordHash = this.employeePasswordDetails.PasswordHash;
      // set user to active
      this.employee.EmployeeStatus = 2;
      this.updateUserPassword();
      this._location.back();
    } else {
      let dialogRef = this.dialog.open(PasswordAlertDialog, {
        width: '50%',
        data: {}
      });
    }
  }

  updateUserPassword() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.employeeService.updateEmployeePasswordSession(this.employee.EmployeeId, this.employee).finally(
          () => this.snackbar.open('Actualizado Correctamente', '', {duration: 5000})))
      .subscribe(data => this.employee = data,
        error => {
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

}

@Component({
  selector: 'password-alert-dialog',
  templateUrl: '../login/login-alert.dialog.html',
})
export class PasswordAlertDialog {

  constructor(public dialogRef: MatDialogRef<PasswordAlertDialog>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
