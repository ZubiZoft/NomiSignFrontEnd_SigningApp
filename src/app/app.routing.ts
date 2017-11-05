import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentsComponent } from './components/documents/documents.component'
import { DocumentDetailComponent } from './components/documentDetail/documentDetail.component'
import { NotFoundComponent } from './components/notfound/notfound.component'
import { LoginComponent } from './components/login/login.component'
import { AuthGuard } from './services/authguard.service'
import { User } from './models/user.model'

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'documents', component: DocumentsComponent, data : User, canActivate: [AuthGuard] },
    { path: 'documents/:id', component: DocumentDetailComponent, data : User, canActivate: [AuthGuard] },
      
    { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}