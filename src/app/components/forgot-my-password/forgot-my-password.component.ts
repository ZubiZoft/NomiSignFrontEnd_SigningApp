import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {EmployeeSecurityQuestionsModel} from '../../models/securityquestions.model';
import {FormControl, Validators} from '@angular/forms';
import {Answers} from '../../models/Answers';
import {LoginAlertDialog} from '../login/login.component';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-my-password',
  templateUrl: './forgot-my-password.component.html',
  styleUrls: ['./forgot-my-password.component.css']
})
export class ForgotMyPasswordComponent implements OnInit {

  securityQuestions: Answers;
  question1FormControl = new FormControl('', [Validators.required]);
  question2FormControl = new FormControl('', [Validators.required]);
  question3FormControl = new FormControl('', [Validators.required]);
  answer1FormControl = new FormControl('', [Validators.required]);
  answer2FormControl = new FormControl('', [Validators.required]);
  answer3FormControl = new FormControl('', [Validators.required]);

  constructor(private authService: AuthService, private userService: UserService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.securityQuestions = this.userService.getAccountF();
  }

  sendSecurityQuestions() {
    if (!this.question1FormControl.hasError('required') &&
      !this.question2FormControl.hasError('required') &&
      !this.question2FormControl.hasError('required') &&
      !this.answer1FormControl.hasError('required') &&
      !this.answer2FormControl.hasError('required') &&
      !this.answer3FormControl.hasError('required')) {
      const message = 'Sí las preguntas fueron contestadas correctamente, se enviara un enlace de restablecimiento de contraseña.';
      this.authService.sendPasswordReset(this.securityQuestions).subscribe(
        data => {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '75%',
            data: {'message': message}
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        }, error => {
          let dialogRef = this.dialog.open(LoginAlertDialog, {
            width: '75%',
            data: {'message': message}
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        }, () => this.userService.clearAccountF());
    }
  }
}
