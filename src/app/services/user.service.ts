import {Injectable, EventEmitter} from '@angular/core';
import {User} from '../models/user.model';
import {EmployeeSecurityQuestionsModel} from '../models/securityquestions.model';
import {Answers} from '../models/Answers';

@Injectable()
export class UserService {
  userUpdated: EventEmitter<any> = new EventEmitter();

  public setUser(user: User) {
    user.CURP = null;
    user.PasswordHash = null;
    user.RFC = null;
    this._user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userUpdated.emit();
  }

  public setAccountF(acc: Answers) {
    sessionStorage.setItem('AccountF', JSON.stringify(acc));
  }

  public getAccountF(): Answers {
    return JSON.parse(sessionStorage.getItem('AccountF'));
  }

  public getUser(): any {
    if (this._user == null) {
      return JSON.parse(sessionStorage.getItem('user'));
    }
    return this._user;
  }

  public isLoggedIn(): boolean {
    if (this._user != null || sessionStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

  public clearUser() {
    sessionStorage.removeItem('user');
    sessionStorage.clear();
    this._user = new User();
    this.userUpdated.emit();
  }

  public clearAccountF() {
    sessionStorage.removeItem('AccountF');
    sessionStorage.clear();
  }

  private _user: User;
}
