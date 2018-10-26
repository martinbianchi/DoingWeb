import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private static errorInLogin = new Subject();
  errorInLogin$ = AuthService.errorInLogin.asObservable();

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  authWindow: Window;
  failed: boolean;
  error: string;
  errorDescription: string;
  
  private rol;

  canActivate(next: ActivatedRouteSnapshot){
    //return true;
    this.getUserLogedRol();
    if(!this.loginService.isLoggedIn()){
      this.router.navigate(['/']);
      return false;
    }
    if(this.isTokenExpired()){
      this.router.navigate(['/']);
      return false;
    }
    let role = this.getUserLogedRol();
    let allowedRole = next.children[0].data['roles'] as Array<string>;
    if(!allowedRole) return true;
    if(!role) return false;
    let canPass = false;
    allowedRole.forEach((el) => {
      if(el == role) canPass = true;
    });
    
    if(canPass){
      return true;
    }
    else{
      this.router.navigate(['/']);
      return false;
    }
    
  }

  getUserLogedRol(){
        let token = this.getDecodedAccessToken();
        if(token)this.rol = token.rol;
        
        return this.rol;
  }

  getUserLogged() {
    let token = this.getDecodedAccessToken();
    return token ? token : null;
  }

  private getDecodedAccessToken(){
    try{
      let token = localStorage.getItem('auth_token');
      return jwt_decode(token);
    }
    catch(Error){
      return null
    }
  }

  private getTokenExpirationDate(){
    let token = this.getDecodedAccessToken();

    if(token.exp == undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(token.exp);
    return date;
  }

  isTokenExpired(): boolean{
    let token = this.getDecodedAccessToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate();
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  handleMessage(event: Event) {
    event.preventDefault();
    const message = event as MessageEvent;

      // Only trust messages from the below origin.
      //
      if ((message.origin !== environment.BASE_URL)) return;
    
    const result = JSON.parse(message.data);

    if (!result.status)
    {
      this.failed = true;
      this.error = result.error;
      this.errorDescription = result.errorDescription;
      this.router.navigate(['/error-login']);
    }
    else
    {
      this.failed = false;

      this.loginService.loginExternalAuthUser(result.accessToken,result.provider)
        .subscribe(           
        result => {
          if (result) {
            AuthService.errorInLogin.next(null);
            this.router.navigate(['/home']);
          }
        },
        error => {
          AuthService.errorInLogin.next(error);
          this.failed = true;
          this.error = error;
          this.router.navigate(['/error-login']);
        });      
    }
  }

}
