import { Component, OnInit } from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';
@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated:boolean;
  userName:string;

  constructor(
    private oktaAuthService:OktaAuthService
  ) { }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) =>{
        this.isAuthenticated=result;
        this.getUserDetails();
      }

    );
  }
  getUserDetails(){

    if(this.isAuthenticated){
      this.oktaAuthService.getUser().then(
        (result) => {
          this.userName =result.name;
        }
      );
    }

  }

  logOut(){
    this.oktaAuthService.signOut();
  }

}
