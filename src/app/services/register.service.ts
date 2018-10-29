import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private _afAuth : AngularFireAuth,
    private _db: AngularFireDatabase,
    private _loginService: LoginService
  ) { }



}
