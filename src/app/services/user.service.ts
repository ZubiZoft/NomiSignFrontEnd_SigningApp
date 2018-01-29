import { Injectable, EventEmitter } from '@angular/core';

import { User } from '../models/user.model'

@Injectable()
export class UserService {
    userUpdated: EventEmitter<any> = new EventEmitter()

    public setUser( user: User) {
        this._user = user
        sessionStorage.setItem('user', JSON.stringify(user))
        this.userUpdated.emit()
    }

    public getUser (): any{
        if (this._user == null){
            return JSON.parse(sessionStorage.getItem('user'))
        }
        return this._user
    }

    public isLoggedIn(): boolean{
        if (this._user != null || sessionStorage.getItem('user') != null){
            return true;
        }
        return false;
    }

    public clearUser(){
        sessionStorage.clear()
        this._user = new User();
        this.userUpdated.emit()
    }

    private _user : User 
}
