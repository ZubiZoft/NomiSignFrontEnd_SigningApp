import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule}    from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatCardModule, MatToolbarModule, MatInputModule, MatListModule, MatIconModule, MatMenuModule, MatSortModule, MatCheckboxModule, MatSnackBarModule, MatDialogModule } from '@angular/material';

import { AppRoutingModule } from './app.routing'

import { DocumentsComponent } from './components/documents/documents.component'
import { DocumentDetailComponent, DocumentSignedNoticeComponent, DocumentRejectNoticeComponent } from './components/documentDetail/documentDetail.component'
import { NotFoundComponent } from './components/notfound/notfound.component'
import { LoginComponent } from './components/login/login.component'
import { AccountComponent } from './components/account/account.component'
import { LoginAlertDialog } from './components/login/login.component'
import { AuthService } from './services/auth.service'
import { DocumentService } from './services/documents.service'
import { UserService } from './services/user.service'
import { AuthGuard } from './services/authguard.service'

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
    LoginAlertDialog
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
    AppRoutingModule,
    MatCheckboxModule,
    FormsModule,
    MatSortModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    HttpModule,
    MatDialogModule
  ],
  providers: [ AuthService, DocumentService, UserService, AuthGuard ],
  bootstrap: [AppComponent],
  entryComponents: [ DocumentSignedNoticeComponent, DocumentRejectNoticeComponent, LoginAlertDialog ],
})
export class AppModule { }
