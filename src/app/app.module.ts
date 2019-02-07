import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatButtonModule, MatCheckboxModule, MatInputModule, MatSidenavModule, MatCardModule, MatListModule, MatIconModule,
  MatSelectModule, MatToolbarModule, MatMenuModule, MatSnackBarModule, MatDatepickerModule,
  MatDialogModule, MatProgressSpinnerModule, MatNativeDateModule
} from '@angular/material';

import {MatTableModule} from '@angular/material/table';

import {AppRoutingModule} from './app.routing';

import {DocumentsComponent} from './components/documents/documents.component';
import {
  DocumentDetailComponent,
  DocumentSignedNoticeComponent,
  DocumentRejectNoticeComponent, Nom151DialogComponent, SignatureConfirmDialogComponent, RejectReasonDialogComponent
} from './components/documentDetail/documentDetail.component';
import {NotFoundComponent} from './components/notfound/notfound.component';
import {LoginComponent} from './components/login/login.component';
import {AccountComponent, AlertTermsComponent} from './components/account/account.component';
import {LoginAlertDialog, ForgotPasswordDialog} from './components/login/login.component';
import {PasswordAlertDialog} from './components/account/account.component';
import {AuthService} from './services/auth.service';
import {DocumentService} from './services/documents.service';
import {UserService} from './services/user.service';
import {AuthGuard} from './services/authguard.service';
import {ChangePasswordComponent} from './components/changepassword/changepassword.component';
import {ChangePhoneComponent} from './components/changephone/changephone.component';
import {EmployeeSecurityQuestionsComponent} from './components/securityquestions/securityquestions.component';
import {SafePipePipe} from './pipes/safe-pipe.pipe';
import {TermsConditionsComponentComponent} from './components/terms-conditions-component/terms-conditions-component.component';
import {AlertPrintComponent, ContractComponentComponent} from './components/contract-component/contract-component.component';
import {EmployeeService} from './services/employee.service';
import {SessionTimeoutDialogComponent} from './components/session-timeout-dialog/session-timeout-dialog.component';
import {ForgotMyPasswordComponent} from './components/forgot-my-password/forgot-my-password.component';
import {DownloadComponent} from './components/download-component';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    NotFoundComponent,
    DocumentsComponent,
    DocumentDetailComponent,
    LoginComponent,
    DocumentSignedNoticeComponent,
    DocumentRejectNoticeComponent,
    LoginAlertDialog,
    ForgotPasswordDialog,
    Nom151DialogComponent,
    SignatureConfirmDialogComponent,
    RejectReasonDialogComponent,
    PasswordAlertDialog,
    AlertTermsComponent,
    ChangePasswordComponent,
    ChangePhoneComponent,
    EmployeeSecurityQuestionsComponent,
    SafePipePipe,
    TermsConditionsComponentComponent,
    ContractComponentComponent,
    SessionTimeoutDialogComponent,
    ForgotMyPasswordComponent,
    AlertPrintComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    AppRoutingModule,
    MatCheckboxModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    HttpModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [AuthService, DocumentService, UserService, AuthGuard, EmployeeService],
  bootstrap: [AppComponent],
  entryComponents: [DocumentSignedNoticeComponent, DocumentRejectNoticeComponent, LoginAlertDialog, PasswordAlertDialog,
    AlertTermsComponent, Nom151DialogComponent, SignatureConfirmDialogComponent, RejectReasonDialogComponent, ForgotPasswordDialog,
    SessionTimeoutDialogComponent, AlertPrintComponent],
})
export class AppModule {
}
