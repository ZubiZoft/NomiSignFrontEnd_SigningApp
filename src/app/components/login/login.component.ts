import {Component, OnInit, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Answers} from '../../models/Answers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  user = {
    CellPhoneNumber: '',
    PasswordHash: ''
  };
  userName: string;
  password: string;
  isPromiseDone = true;
  hide = true;

  activeUser: User;
  usernameFormControl = new FormControl('', [
    Validators.required]);

  passwordFormControl = new FormControl('', [
    Validators.required]);


  constructor(private authService: AuthService, private router: Router, private userService: UserService, public dialog: MatDialog) {

  }

  ngOnInit() {
  }

  gotoForgotPassword(): boolean {
    if (this.usernameFormControl.hasError('required') || this.usernameFormControl.hasError('email')) {
      var message = 'Coloca tu número célular o email y entonces oprime \'Olvidé mi contraseña\'';
      let dialogRef = this.dialog.open(LoginAlertDialog, {
        width: '50%',
        data: {'message': message}
      });
    } else {
      this.authService.getQuestions(this.userName).subscribe(
        userData => {
          let u = new Answers();
          u.Q1 = userData.SecurityQuestion1;
          u.Q2 = userData.SecurityQuestion2;
          u.Q3 = userData.SecurityQuestion3;
          u.Email = this.userName;
          this.userService.setAccountF(u);
          this.router.navigate(['/forgot-my-password']);
        },
        error => {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '50%',
            data: {'message': 'El número célular o email son incorrectos.'}
          });
        });
    }
    return false;
  }

  reroute(activeUser) {
    this.userService.setUser(activeUser);
    this.router.navigate(['/layout']);
  }

  login() {
    this.isPromiseDone = false;
    this.user.CellPhoneNumber = this.userName;
    this.user.PasswordHash = this.password;
    if (this.userName === '') {
      let dialogRef = this.dialog.open(LoginAlertDialog, {
        width: '50%',
        data: {'message': 'El número celular y/o contraseña provistos no pudieron ser autenticados con exito'}
      });
      return;
    }
    this.authService.loginUser(this.user).subscribe(
      userData => this.userService.setUser(userData),
      error => {
        console.log(error);
        if (error.status === 409) {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '50%',
            data: {
              'message': 'Cuenta bloqueada',
              'body': 'Tu cuenta ha sido bloqueda temporalmente. Por favor, utiliza \'Olvidé mi contraseña\' para reactivarla.'
            }
          });
        } else {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '50%',
            data: {'message': 'El número celular y/o contraseña provistos no pudieron ser autenticados con exito'}
          });
        }
      },
      () => this.router.navigate(['/documents']));
  }


}

@Component({
  selector: 'login-alert-dialog',
  templateUrl: 'login-alert.dialog.html',
})
export class LoginAlertDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoginAlertDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  loginMessage: string;
  bodyMessage: string;

  ngOnInit() {
    this.loginMessage = this.data['message'];
    this.bodyMessage = this.data['body'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

