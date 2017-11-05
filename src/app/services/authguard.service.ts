import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service'

@Injectable()
export class AuthGuard {

  constructor( private userService : UserService, private router : Router ) {
  }

  canActivate( route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) {
    if (this.userService.isLoggedIn()){
        return true;
    } 
    this.router.navigate(['/login']);
    return false;
  }
}