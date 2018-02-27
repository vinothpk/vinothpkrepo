import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { ToastyService } from 'ng2-toasty';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {
  private roles: string[] = [];
  profile: any;

  auth0 = new auth0.WebAuth({
    clientID: 'nwmSTLC27VLcPyg6Mg06CELUCf2S1GOk',
    domain: 'vinauth.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.vinauth.com',
    redirectUri: 'http://localhost:5000/vehicles',
    scope: 'openid email profile' //scope: 'openid email profile name picture'
  });

  constructor(public router: Router, private toastyService: ToastyService) {
    this.readUserFromLocalStorage();
   }

  public login() {
    this.auth0.authorize();
  }

  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      console.log("Auth Result", authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.onUserAuthenticated(authResult);
        this.readUserFromLocalStorage();

        this.toastyService.success({
          title: 'Login Success',
          msg: 'Hello Welcome',
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
      }
      else if (err) {
        this.router.navigate(['/vehicles']);
        this.toastyService.error({
          title: 'Login Failed',
          msg: 'Error Occurred',
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
      }
    });
  }

  private setSession(authResult: any) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  private onUserAuthenticated(authResult: any) {
    if(authResult.accessToken) {
      this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
        if(error)
          throw error;
        
        localStorage.setItem('profile', JSON.stringify(profile));
      });
    }
  }

  private readUserFromLocalStorage() {
    this.profile = JSON.parse(localStorage.getItem('profile'));
    
    var token = localStorage.getItem('token');
    if(token) {
      var jwtHelper = new JwtHelper();
      var decodedToken = jwtHelper.decodeToken(token);
      this.roles = decodedToken['https://vinvega.com/roles'] || [];
      console.log("Roles are", this.roles);
    }
  }

  public logout(message: any) {
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.profile = null;
    this.roles = [];

    this.toastyService.success({
      title: 'Logged out successfully',
      msg: message,
      theme: 'bootstrap',
      showClose: true,
      timeout: 5000
    });

    this.router.navigate(['/vehicles']);
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    let isActive: boolean = new Date().getTime() < expiresAt;

    if(expiresAt != null && !isActive)
      this.logout('Token Expired');
    return new Date().getTime() < expiresAt;
  }

  public isInRole(roleName: any){
    return this.roles.indexOf(roleName) > -1;
  }

}