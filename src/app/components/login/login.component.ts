import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model'

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ AuthService ]
})
export class LoginComponent implements OnInit {
  user = {
    EmailAddress: '',
    PasswordHash: ''
  };
  userName: string
  password: string

  activeUser: User;
  usernameFormControl = new FormControl('', [
    Validators.required]);

  passwordFormControl = new FormControl('', [
    Validators.required]);


  constructor(private authService: AuthService, private router: Router, private userService: UserService, public dialog: MatDialog) {

  }

  ngOnInit() {

  }

  reroute(activeUser) {
    this.userService.setUser(activeUser);
    this.router.navigate(['/layout'])
  }

  login() {
    this.user.EmailAddress = this.userName
    this.user.PasswordHash = this.password
    this.authService.loginUser(this.user).subscribe(
      userData => this.userService.setUser(userData),
      error => {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
          width: '50%',
          data: { }
        })
      ;},
      () =>  this.router.navigate(['/documents']))
  }


}

@Component({
  selector: 'login-alert-dialog',
  templateUrl: 'login-alert.dialog.html',
})
export class LoginAlertDialog {

  constructor(public dialogRef: MatDialogRef<LoginAlertDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



// import { Component, OnInit } from '@angular/core';
// import { FormControl, Validators } from '@angular/forms';
// import { Router } from '@angular/router'

// import { AuthService } from '../../services/auth.service';
// import { UserService } from '../../services/user.service';
// import { User } from '../../models/user.model'

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   user = {
//     EmailAddress: '',
//     PasswordHash: ''
//   };
//   userName: string
//   password: string

//   activeUser: User;
//   usernameFormControl = new FormControl('', [
//     Validators.required]);

//   passwordFormControl = new FormControl('', [
//     Validators.required]);


//   constructor(private authService: AuthService, private router: Router, private userService: UserService) {

//   }

//   ngOnInit() {

//   }

//   reroute(activeUser) {
//     this.userService.setUser(activeUser);
//     this.router.navigate(['/documents'])
//   }

//   login() {
//     this.user.EmailAddress = this.userName
//     this.user.PasswordHash = this.password
//     this.authService.loginUser(this.user).subscribe(
//       userData => this.userService.setUser(userData),
//       error => console.log('erroer' + error),
//       () => this.router.navigate(['/documents']))
//   }


// }
