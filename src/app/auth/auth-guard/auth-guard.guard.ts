import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OktaAuthGuard, OktaAuthService } from '@okta/okta-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  isAuthentic:boolean;

  constructor(
    private oktaAuthService:OktaAuthService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) :boolean{


    return true;
  }

}
