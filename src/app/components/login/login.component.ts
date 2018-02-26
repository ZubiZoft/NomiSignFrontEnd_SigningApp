import {Component, OnInit, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
  isPromiseDone: boolean = true;

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
    var message = 'Se envio un enlace de restablecimiento de contrasena a su numero celular en el archivo';
    if (this.usernameFormControl.hasError('required') || this.usernameFormControl.hasError('email')) {
      message = 'Pon su numero celular y entonces oprima \'me Olvide Mi Contrasena\'';
      let dialogRef = this.dialog.open(LoginAlertDialog, {
        width: '50%',
        data: {'message': message}
      });
    }
    else {
      this.user.CellPhoneNumber = this.userName;
      this.authService.sendPasswordReset(this.user).subscribe(
        userData => {
          this.userService.setUser(userData);
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '50%',
            data: {'message': message}
          });
        },
        error => {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '50%',
            data: {'message': 'Sí el número celular proporcionado fue correcto, se enviara un enlace de restablecimiento de contraseña'}
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
    this.authService.loginUser(this.user).subscribe(
      userData => this.userService.setUser(userData),
      error => {
        let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '50%',
            data: {'message': 'El numero celular y / o contrasena provistos no pudieron ser autenticados con exito'}
          });
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

  ngOnInit() {
    this.loginMessage = this.data['message']; //"The email and/or password provided could not be authenticated sucessfully.";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

