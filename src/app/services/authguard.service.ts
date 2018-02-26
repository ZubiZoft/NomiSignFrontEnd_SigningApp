import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {EmployeeService} from './employee.service';
import {EmployeeModel} from '../models/employee.model';

@Injectable()
export class AuthGuard {

  constructor(private userService: UserService, private router: Router, private employeeService: EmployeeService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.isLoggedIn()) {
      const emp: EmployeeModel = this.userService.getUser();
      if (emp.CellPhoneNumber != null && emp.CellPhoneNumber != '') {
        this.employeeService.looksForContracts(emp).subscribe(data => {
            console.log(data);
            if (data != -1) {
              this.router.navigate(['/contract', data]);
              return false;
            }
            return true;
          },
          () => {
            this.router.navigate(['/login']);
            return false;
          });
      } else {
        emp.CellPhoneNumber = emp.EmailAddress;
        this.employeeService.looksForContracts(emp).subscribe(data => {
            console.log(data);
            if (data != -1) {
              this.router.navigate(['/contract', data]);
              return false;
            }
            return true;
          },
          () => {
            this.router.navigate(['/login']);
            return false;
          });
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
