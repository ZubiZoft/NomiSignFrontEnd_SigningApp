import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, AbstractControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeModel} from '../../models/employee.model';
import {MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {UserService} from '../../services/user.service';
import {EmployeeSecurityQuestionsModel} from '../../models/securityquestions.model';

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
  securityQuestions: EmployeeSecurityQuestionsModel;

  constructor(private router: Router, private route: ActivatedRoute, public snackbar: MatSnackBar,
              private employeeService: EmployeeService, private formBuilder: FormBuilder, public dialog: MatDialog,
              public userService: UserService) {
    this.form = formBuilder.group({
      'securityCode': [null, Validators.compose([Validators.minLength(3), Validators.required])],
      'firstName': [null, Validators.required],
      'lastName1': [null, Validators.required],
      'lastName2': [null, Validators.required],
      'password': [null, Validators.compose([Validators.required,
        Validators.pattern('^(?!(.{0,5}|[^0-9]*|[^A-Z]*|[^a-z]*)$).*$')])],
      'verifyPassword': [null, Validators.required],
      'SecurityQuestion1': [null, Validators.required],
      'SecurityAnswer1': [null, Validators.required],
      'SecurityQuestion2': [null, Validators.required],
      'SecurityAnswer2': [null, Validators.required],
      'SecurityQuestion3': [null, Validators.required],
      'SecurityAnswer3': [null, Validators.required]
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
    this.securityQuestions = new EmployeeSecurityQuestionsModel();
  }

  ngOnInit(): void {
    this.userService.clearUser();
    this.employee = new EmployeeModel();
    this.employeePasswordDetails = new EmployeeModel();

    this.route.paramMap
      .switchMap((params: ParamMap) => this.employeeService.employeeByIdExixts(params.get('uid')))
      .subscribe(
        data => {
          this.isPromiseDone = true;
          this.employee = data;
          this.employeePasswordDetails.FirstName = this.employee.FirstName;
          this.employeePasswordDetails.LastName1 = this.employee.LastName1;
          this.employeePasswordDetails.LastName2 = this.employee.LastName2;
        }, error => {
          this.userService.clearUser();
          this.router.navigate(['/login']);
        });
  }


  reroute(activeUser) {
    // will need phone later maybe  this.employeePasswordDetails.EmailAddress === this.employee.EmailAddress &&
    if (this.form.valid) {
      this.isPromiseDone = false;
      this.employee.PasswordHash = this.employeePasswordDetails.PasswordHash;
      this.employee.SecurityCode = this.employeePasswordDetails.SecurityCode;
      this.employee.FirstName = this.employeePasswordDetails.FirstName;
      this.employee.LastName1 = this.employeePasswordDetails.LastName1;
      this.employee.LastName2 = this.employeePasswordDetails.LastName2;
      this.employee.EmployeeStatus = 2;
      this.employee.Question1 = this.securityQuestions.SecurityQuestion1;
      this.employee.Question2 = this.securityQuestions.SecurityQuestion2;
      this.employee.Question3 = this.securityQuestions.SecurityQuestion3;
      this.employee.Answer1 = this.securityQuestions.SecurityAnswer1;
      this.employee.Answer2 = this.securityQuestions.SecurityAnswer2;
      this.employee.Answer3 = this.securityQuestions.SecurityAnswer3;
      let dialogRef = this.dialog.open(AlertTermsComponent, {
        width: '80%',
        height: '80%',
        data: {
          'securityQuestions' : this.securityQuestions,
          'employeePasswordDetails' : this.employee,
          'employeeId' : this.employee.EmployeeId
        }
      });
      dialogRef.afterClosed().subscribe(
        () => {
          this.isPromiseDone = true;
        });
    } else {
      let dialogRef = this.dialog.open(PasswordAlertDialog, {
        width: '50%',
        data: {'message': '¡Por favor, revise todos los campos!'}
      });
    }

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

  securityQuestions: EmployeeSecurityQuestionsModel;
  employeePasswordDetails: EmployeeModel;

  constructor(public dialogRef: MatDialogRef<AlertTermsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute,
              public snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.securityQuestions = this.data['securityQuestions'];
    this.employeePasswordDetails = this.data['employeePasswordDetails'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  accepted(): void {
    this.updateUserPassword(this.employeePasswordDetails);
  }

  updateUserPassword(employee: EmployeeModel) {
    this.employeeService.updateEmployeePassword(employee.EmployeeId, employee)
      .subscribe(
        data => {
          employee = data;
          this.snackbar.open('Cuenta actualizada correctamente', '', {duration: 5000});
          this.router.navigate(['/login']);
          this.dialogRef.close();
        },
        error => {
          this.dialogRef.close();
          this.snackbar.open('El código de seguridad es incorrecto, por favor revisa tu información',
            '', {duration: 10000});
        });
  }
}

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('verifyPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('verifyPassword').setErrors({MatchPassword: true});
    } else {
      return null;
    }
  }
}
