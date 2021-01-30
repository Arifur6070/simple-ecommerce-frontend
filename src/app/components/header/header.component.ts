import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated:boolean;

  constructor(
    private oktaAuthService:OktaAuthService
  ) { }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated=result;
      }
    );
  }

}
