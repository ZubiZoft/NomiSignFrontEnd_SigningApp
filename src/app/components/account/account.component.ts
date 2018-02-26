import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeModel} from '../../models/employee.model';
import {MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'ng-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [EmployeeService]
})
export class AccountComponent implements OnInit {

  employee: EmployeeModel;
  employeePasswordDetails: EmployeeModel;
  isPromiseDone = false;
  hide = true;
  hideV = true;
  form: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, public snackbar: MatSnackBar, private employeeService: EmployeeService,
              private formBuilder: FormBuilder, public dialog: MatDialog, public userService: UserService) {
    this.form = formBuilder.group({
      'securityCode': [null, Validators.compose([Validators.minLength(4), Validators.required])],
      'firstName': [null, Validators.required],
      'lastName1': [null, Validators.required],
      'lastName2': [null, Validators.required],
      'password': [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$')])],
      'verifyPassword': [null, Validators.compose([Validators.required, Validators.pattern('')])]
    });
  }

  ngOnInit(): void {
    this.userService.clearUser();
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
    if (this.form.valid) {
      let dialogRef = this.dialog.open(AlertTermsComponent, {
        width: '50%',
        height: '50%',
        data: this
      });
      dialogRef.afterClosed().subscribe(() => {
        dialogRef.close();
      });
    } else {
      let dialogRef = this.dialog.open(PasswordAlertDialog, {
        width: '50%',
        data: {'message': '¡Por favor, revise todos los campos!'}
      });
    }

  }

  updateUserPassword() {
    this.route.paramMap
      .switchMap(
        (params: ParamMap) => this.employeeService.updateEmployeePassword(this.employee.EmployeeId, this.employee).finally(
          () => {
            this.snackbar.open('sucessfully updated', '', {duration: 5000});
            this.router.navigate(['/login']);
          }))
      .subscribe(data => this.employee = data,
        error => this.snackbar.open(error, '', {duration: 5000}));
  }
}

@Component({
  selector: 'password-alert-dialog',
  templateUrl: '../login/login-alert.dialog.html',
})
export class PasswordAlertDialog implements OnInit {

  loginMessage: string;

  constructor(public dialogRef: MatDialogRef<PasswordAlertDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.loginMessage = this.data['message'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'alert-terms-component',
  templateUrl: 'alert-terms-component.html'
})
export class AlertTermsComponent implements OnInit {

  view: AccountComponent;

  constructor(public dialogRef: MatDialogRef<AlertTermsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.view = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  accepted(): void {
    this.view.employee.PasswordHash = this.view.employeePasswordDetails.PasswordHash;
    this.view.employee.SecurityCode = this.view.employeePasswordDetails.SecurityCode;
    this.view.employee.FirstName = this.view.employeePasswordDetails.FirstName;
    this.view.employee.LastName1 = this.view.employeePasswordDetails.LastName1;
    this.view.employee.LastName2 = this.view.employeePasswordDetails.LastName2;
    this.view.employee.EmployeeStatus = 2;

    this.view.updateUserPassword();

    this.dialogRef.close();
  }

}
