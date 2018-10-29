import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/User';
import * as jwt_decode from "jwt-decode";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isLogging = new Subject<boolean>();
  isLogging$ = this.isLogging.asObservable();

  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private user: User;
  private userLoged = new BehaviorSubject<User>(this.user);
  userLoged$ = this.userLoged.asObservable();

  private loggedIn = false;



  constructor(private _httpService: HttpClient,
    private _afAuth : AngularFireAuth,
    private _db: AngularFireDatabase) { 

    this.loggedIn = !!localStorage.getItem('auth_token');
    this._authNavStatusSource.next(this.loggedIn);

    if(!!localStorage.getItem('user_loged')){
      this.userLoged.next(JSON.parse(localStorage.getItem('user_loged')));
    }
  }

  loginFirebase(user:string, password:string){
    this.isLogging.next(true);
    return new Promise((resolve, reject) =>{
      this._afAuth.auth.signInWithEmailAndPassword(user, password)
      .catch((error) => {
        console.log(error);
        reject();
      })
      .then((us) =>{
        this._afAuth.auth.currentUser.getIdToken()
          .then((tok) => {
            localStorage.setItem('auth_token', tok);
            
           this._db.list('/users/'+this._afAuth.auth.currentUser.uid).query.once('value')
              .then((us) =>{
                console.log(us.val());
                this.user = new User();
                this.user.email = us.val().Email;
                this.user.first_name = us.val().Name;
                this.user.last_name = us.val().Surname;
                this.user.id = this._afAuth.auth.currentUser.uid;

                this.userLoged.next(this.user);
                localStorage.setItem('user_loged', JSON.stringify(this.user));
                this.loggedIn = true;
                this._authNavStatusSource.next(true);
                this.isLogging.next(false);
                resolve();
              });
          });
      });
    })
    
  }

  newAccount(user){
    return new Promise((resolve, reject) => {
      this._afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
      console.log(this._afAuth.auth.currentUser.uid);
        this._afAuth.auth.currentUser.getIdToken()
          .then((tok) => {

            user.id = this._afAuth.auth.currentUser.uid;
            this._db.list('/users').set(user.id, {Name: user.first_name, Email: user.email, Surname: user.last_name, Password: user.password})
              .then(() => {
                this.userLoged.next(user);
                localStorage.setItem('auth_token', tok);
                localStorage.setItem('user_loged', JSON.stringify(user));
                this.user = user;
                resolve();
              }).catch((err) => reject(err));
          }).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }

  getUserLoged(){
    return JSON.parse(localStorage.getItem('user_loged'));
  }

  loginExternalAuthUser(accessToken:string, endpoint:string){
    this.isLogging.next(true);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify({ accessToken });  
    let url = 'api/externalauth/'+endpoint;
    return this._httpService
      .post(
        url, body, httpOptions)
      .map((res: any) => {

        localStorage.setItem('auth_token', res.auth_token);           
        this.user = new User();
        this.user.name = res.name;
        this.userLoged.next(this.user);

        localStorage.setItem('user_loged',JSON.stringify(this.user));

        this.loggedIn = true;
        this._authNavStatusSource.next(true);
        this.isLogging.next(false);
        return res;
      })
      //.catch(this.handleError)
      .finally(() => this.isLogging.next(false));
  }

  loginHoshinUser(userName, password) {
    this.isLogging.next(true);
    return this._httpService.post('/api/auth/login', JSON.stringify({userName, password}), httpOptions)
    .map((res: any) => {
      localStorage.setItem('auth_token', res.auth_token);
      this.user = new User();
      this.user.name = userName;
      this.userLoged.next(this.user);

      localStorage.setItem('user_loged',JSON.stringify(this.user));
      this.loggedIn = true;
      this._authNavStatusSource.next(true);
      this.isLogging.next(false);
      return res;
    })
    //.catch(this.handleError)
    .finally(() => {
      this.isLogging.next(false);
    });
  }

  logout(){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_loged');
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }

  isLoggedIn(){
    return this.loggedIn;
  }

}
