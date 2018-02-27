import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(protected auth: AuthService) { }

  canActivate() {
      if(this.auth.isAuthenticated())
        return true;

      this.auth.login(); //window.location.href = 'https://vinauth.auth0.com/login?client=nwmSTLC27VLcPyg6Mg06CELUCf2S1GOk';
      return false;
  }

}