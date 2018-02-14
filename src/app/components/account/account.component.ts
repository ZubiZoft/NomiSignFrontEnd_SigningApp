﻿import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeModel} from '../../models/employee.model';
import {MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'ng-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [EmployeeService]
})
export class AccountComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, public snackbar: MatSnackBar, private employeeService: EmployeeService,
              private _formBuilder: FormBuilder, public dialog: MatDialog) {
  }

  employee: EmployeeModel;
  employeePasswordDetails: EmployeeModel;
  // employeeID: string;
  isPromiseDone: boolean = false;
  usernameFormControl = new FormControl('', [
    Validators.email]);
  hide = true;
  hideV = true;

  securityCodeFormControl = new FormControl('', [Validators.required]);

  nameFormControl = new FormControl('', [Validators.required]);

  last1FormControl = new FormControl('', [Validators.required]);

  last2FormControl = new FormControl('', [Validators.required]);

  passwordFormControl = new FormControl('', [Validators.required]);

  passwordVerifyFormControl = new FormControl('', [Validators.required, Validators.pattern('')]);

  ngOnInit(): void {
    this.employee = new EmployeeModel();
    this.employeePasswordDetails = new EmployeeModel();

    this.route.paramMap
      .switchMap((params: ParamMap) => this.employeeService.getEmployeeById(params.get('uid')))
      .subscribe(data => {
        this.employee = data;
        this.isPromiseDone = true;
      });
  }


  reroute(activeUser) {

    // will need phone later maybe  this.employeePasswordDetails.EmailAddress === this.employee.EmailAddress &&
    if ((!this.passwordVerifyFormControl.hasError('pattern'))) {
      this.employee.PasswordHash = this.employeePasswordDetails.PasswordHash;
      this.employee.SecurityCode = this.employeePasswordDetails.SecurityCode;
      // set user to active
      this.employee.EmployeeStatus = 2;
      this.updateUserPassword();
      this.router.navigate(['/login']);
    }
    else {
      let dialogRef = this.dialog.open(PasswordAlertDialog, {
        width: '50%',
        data: {}
      });
    }

  }

  updateUserPassword() {
    this.route.paramMap
      .switchMap(
        (params: ParamMap) => this.employeeService.updateEmployeePassword(this.employee.EmployeeId, this.employee).finally(
          () => this.snackbar.open('sucessfully updated', '', {duration: 5000})))
      .subscribe(data => this.employee = data,
        error => this.snackbar.open(error, '', {duration: 5000}));
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
