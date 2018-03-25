import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentsComponent} from './components/documents/documents.component';
import {DocumentDetailComponent} from './components/documentDetail/documentDetail.component';
import {NotFoundComponent} from './components/notfound/notfound.component';
import {LoginComponent} from './components/login/login.component';
import {AccountComponent} from './components/account/account.component';
import {AuthGuard} from './services/authguard.service';
import {ChangePasswordComponent} from './components/changepassword/changepassword.component';
import {ChangePhoneComponent} from './components/changephone/changephone.component';
import {User} from './models/user.model';
import {EmployeeSecurityQuestionsComponent} from './components/securityquestions/securityquestions.component';
import {ContractComponentComponent} from './components/contract-component/contract-component.component';
import {ForgotMyPasswordComponent} from './components/forgot-my-password/forgot-my-password.component';

const routes: Routes = [
  {path: 'account/:uid', component: AccountComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'forgot-my-password', component: ForgotMyPasswordComponent},
  {path: 'contract/:id', component: ContractComponentComponent},
  {path: 'documents', component: DocumentsComponent, data: User, canActivate: [AuthGuard]},
  {path: 'documents/:id', component: DocumentDetailComponent, data: User, canActivate: [AuthGuard]},
  {path: 'changepassword/:uid', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'changephone/:uid', component: ChangePhoneComponent, canActivate: [AuthGuard]},
  {path: 'securityquestions/:uid', component: EmployeeSecurityQuestionsComponent, canActivate: [AuthGuard]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
