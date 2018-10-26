import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormControlName } from "@angular/forms"; 
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FactoryLogin } from '../factories/factory-login';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { IUserServices } from '../interfaces/IUserServices';
import { AuthService} from '../services/auth.service';
import { LoginService } from '../services/login.service';

import { AngularFireDatabase } from "angularfire2/database"; 
import { AngularFireAuth } from '@angular/fire/auth';

import { GenericValidatorDirective } from '../shared/directives/generic-validator.directive';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef }) formInputElements: ElementRef[];
  @BlockUI() blockUI: NgBlockUI;
  private ngUnsuscribe: Subject<void> = new Subject<void>();

  //if set this variables globally, we can parametrize login they can access
  usingFacebookLogin = false;
  usingGoogleLogin = false;
  usingGraphLogin = true;

  loginForm: FormGroup;
  submitted = false;
  private serviceLogin: IUserServices;
  public errorLogin = false;
  private errorType;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidatorDirective;
  public user : firebase.auth.AuthCredential;
 

  constructor(private formBuilder: FormBuilder,
    private loginFactory: FactoryLogin, 
    private router: Router,
    private _loginService: LoginService,
    private _authService: AuthService,
    private _afAuth : AngularFireAuth
    ) { 

      
    this.validationMessages = {
      email:{
        required: 'El email es requerido.',
        email: 'El email debe ser válido.'
      },
      password:{
        required: 'El password es requerido'
      }
    };

   this.genericValidator = new GenericValidatorDirective(this.validationMessages);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    
    let token = localStorage.getItem('auth_token');
        if(!!token) this.router.navigate(['/home']); 

        this._loginService.isLogging$
        .takeUntil(this.ngUnsuscribe)
        .subscribe((val)=>{        
            if(val){
                this.blockUI.start("Cargando...");
            }
            else{
                this.blockUI.stop();
            }
        });

        this._authService.errorInLogin$
            .takeUntil(this.ngUnsuscribe)
            .subscribe((res: any) => {
                if(res){
                    this.errorLogin = true;
                    this.errorType = res.error;
                }
                else{
                    this.errorLogin = false;
                }
            });
  }

  //convenience getter for easy access to form fields
  get f(){ return this.loginForm.controls; }


  onLogin(x) {
    this.serviceLogin = this.loginFactory.createLogin(x);
    this.serviceLogin.login();
  }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }

    if(this.serviceLogin){
      this.serviceLogin.closeWindow();
    }
    this._loginService.loginFirebase(this.f.email.value, this.f.password.value)
      .then(() => {
        this.router.navigate(['/home']);
      })
  }


  ngAfterViewInit(){

    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.loginForm.valueChanges, ...controlBlurs)
      .takeUntil(this.ngUnsuscribe)
      .subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.loginForm);
      })
  }

  ngOnDestroy(){
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }
}
