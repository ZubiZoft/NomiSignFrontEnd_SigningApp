//angular imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
//rxjs imports
import "rxjs/add/operator/switchMap";
import 'rxjs/add/operator/finally'
//custom imports
//import { UserService } from '../../../services/user.service'
import { SecurityQuestionService } from '../../services/securityquestions.service'
import { EmployeeSecurityQuestionsModel } from '../../models/securityquestions.model'
//angular material imports
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ng-security-questions-new',
  templateUrl: './securityquestions.component.html',
  styleUrls: ['./securityquestions.component.css'],
  providers: [SecurityQuestionService ]
})
export class EmployeeSecurityQuestionsComponent implements OnInit {
    securityQuestions: EmployeeSecurityQuestionsModel;
    employeeID: string;
    isFirstTime: boolean;
    question1FormControl = new FormControl('', [Validators.required]);
    question2FormControl = new FormControl('', [Validators.required]);
    question3FormControl = new FormControl('', [Validators.required]);
    answer1FormControl = new FormControl('', [Validators.required]);
    answer2FormControl = new FormControl('', [Validators.required]);
    answer3FormControl = new FormControl('', [Validators.required]);


    constructor(private route: ActivatedRoute, private securityQuestionService: SecurityQuestionService, public snackbar: MatSnackBar, private _location: Location) { 
      
  }

    ngOnInit(): void {
        // needed for never set up questions
        this.securityQuestions = new EmployeeSecurityQuestionsModel();
        this.route.params.subscribe((params: Params) => {
            this.employeeID = params['uid'];
        })
        this.route.paramMap
            .switchMap((params: ParamMap) => this.securityQuestionService.getEmployeeSecurityQuestions(this.employeeID))
            .subscribe(data => { this.securityQuestions = data; if (this.securityQuestions.SecurityQuestion1 == null) this.isFirstTime = true; });
    }

    saveNewSecurityQuestions() {
        if (!this.question1FormControl.hasError('required') && 
            !this.question2FormControl.hasError('required') && 
            !this.question2FormControl.hasError('required') &&
            !this.answer1FormControl.hasError('required') && 
            !this.answer2FormControl.hasError('required') && 
            !this.answer3FormControl.hasError('required')) {

            if (this.isFirstTime) {
                this.route.paramMap
                    .switchMap((params: ParamMap) => this.securityQuestionService.saveNewEmployeeSecurityQuestions(this.securityQuestions))
                    .subscribe(
                    data => { this.securityQuestions = data; this._location.back(); },
                    error => this.snackbar.open(error, "", { duration: 5000 }),
                    () => this.snackbar.open("Successfully Updated", "", { duration: 5000 })
                    )
            }
            else {
                this.route.paramMap
                    .switchMap((params: ParamMap) => this.securityQuestionService.updateEmployeeSecurityQuestions(this.employeeID, this.securityQuestions))
                    .subscribe(
                    data => { this.securityQuestions = data; this._location.back(); },
                    error => this.snackbar.open(error, "", { duration: 5000 }),
                    () => this.snackbar.open("Successfully Updated", "", { duration: 5000 })
                    )
            }
        }
  }
}