import {Component, OnChanges} from '@angular/core';
import {Router, NavigationStart, ActivatedRoute, ParamMap} from '@angular/router';

import {UserService} from './services/user.service';
import {SettingsService} from './services/settings.service';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SettingsService]
})
export class AppComponent {
  title: string;
  username: string;
  displayName: string;
  displayNameMobile: string;
  userId: number;

  constructor(private userService: UserService, private settingsService: SettingsService, private router: Router,
              private activatedRoute: ActivatedRoute) {
    settingsService.getSystemSettings().subscribe(data => this.title = data[0].ProductName);
    this.getCurrentUser();
    this.userService.userUpdated.subscribe((value) => {
      this.getCurrentUser();
    });
    console.log(this.router.url);
  }

  getCurrentUser() {
    let user = this.userService.getUser();

    if (user) {
      this.userId = user.EmployeeId;
      this.displayName = user.FullName;
      this.username = user.CellPhoneNumber;
      this.displayNameMobile = user.FullName;
      if (user.FullName) {
        if (user.FullName.length > 20) {
          this.displayNameMobile = user.FullName.substr(0, 20) + '...';
        }
      }
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

}
