import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {EmployeeService} from './employee.service';
import {EmployeeModel} from '../models/employee.model';
import {User} from '../models/user.model';
import {SessionTimeoutDialogComponent} from '../components/session-timeout-dialog/session-timeout-dialog.component';
import {MatDialog} from '@angular/material';

@Injectable()
export class AuthGuard {

  constructor(private userService: UserService, private router: Router, private employeeService: EmployeeService,
              public dialog: MatDialog) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.isLoggedIn()) {
      const emp: EmployeeModel = this.userService.getUser();
      if (emp.CellPhoneNumber != null && emp.CellPhoneNumber != '') {
        this.employeeService.looksForContracts(emp).subscribe(data => {
          let temp = data;
          if (temp > 0) {
            this.router.navigate(['/contract', data]);
            return false;
          } else if (temp === 0) {
            this.router.navigate(['/securityquestions', emp.EmployeeId]);
            return false;
          }
          return true;
        }, error => {
          if (error.status === 405) {
            let dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
              width: '75%'
            });
            dialogRef.afterClosed().subscribe( () => { return false; });
          } else {
            this.userService.clearUser();
            this.router.navigate(['/login']);
          }
        });
      } else {
        emp.CellPhoneNumber = emp.EmailAddress;
        this.employeeService.looksForContracts(emp).subscribe(data => {
            console.log(data);
            if (data > 0) {
              this.router.navigate(['/contract', data]);
              return false;
            } else if (data === 0) {
              this.router.navigate(['/securityquestions', emp.EmployeeId]);
              return false;
            }
            return true;
          },
          error => {
            if (error.status === 405) {
              let dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
                width: '75%'
              });
              dialogRef.afterClosed().subscribe( () => { return false; });
            } else {
              this.userService.clearUser();
              this.router.navigate(['/login']);
            }
          });
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
