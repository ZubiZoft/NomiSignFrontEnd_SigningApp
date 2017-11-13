import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
//import { AlertComponent } from '../alert/alert.component'

import { SettingsService } from '../../services/settings.service'

//angular material imports
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ng-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  //systemSettings
  //isPromiseDone: boolean = false

  ngOnInit(): void {

  }

  constructor(private router: Router) {
      
  }

  reroute(activeUser) {
      this.router.navigate(['/login']);
  }

}
