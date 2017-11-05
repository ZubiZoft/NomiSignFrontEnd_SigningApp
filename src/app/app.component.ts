import { Component, OnChanges } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router'

import { UserService } from './services/user.service'
import { SettingsService } from './services/settings.service'

import 'rxjs/add/operator/filter'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ SettingsService ]
})
export class AppComponent {
  title : string
  username : string
  
  constructor(private userService: UserService, private settingsService : SettingsService, private router: Router, private activatedRoute: ActivatedRoute){
    settingsService.getSystemSettings().subscribe(data => this.title = data[0].ProductName)
    this.getCurrentUser()
    this.userService.userUpdated.subscribe((value) => {
      this.getCurrentUser()
    })
  }

  getCurrentUser(){
    let user = this.userService.getUser()
    if (user){
      this.username = user.EmailAddress;
    }     
  }

  logout(){
    this.userService.clearUser();
    this.router.navigate(['/login'])
  }

}