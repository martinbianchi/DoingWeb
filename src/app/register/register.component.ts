import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormControlName } from "@angular/forms"; 
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from "angularfire2/database"; 
import { AngularFireAuth } from '@angular/fire/auth';

import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenericValidatorDirective } from 'src/app/shared/directives/generic-validator.directive';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import { LoginService } from 'src/app/services/login.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef }) formInputElements: ElementRef[];
  @BlockUI() blockUI: NgBlockUI;
  private ngUnsuscribe: Subject<void> = new Subject<void>();
  private genericValidator: GenericValidatorDirective;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  registerForm: FormGroup;

  anotherError = false;
  descrAnotherError;
  percentUpload = "60%";

  profileUrlPhoto;

  get email() { return this.registerForm.get('email'); }
  get surname() { return this.registerForm.get('surname'); }
  get name() { return this.registerForm.get('name'); }
  get password() { return this.registerForm.get('password');}
  get confirmPassword() { return this.registerForm.get('confirmPassword');}
  downloadURL;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _registerService : LoginService,
    private _afAuth : AngularFireAuth,
    private storage: AngularFireStorage
  ) { 
    this.validationMessages = {
      email:{
        required: 'El email es requerido.',
        email: 'El email debe ser válido.'
      },
      password:{
        required: 'La contraseña es requerida'
      },
      confirmPassword:{
        required: 'la confirmación es requerida'
      },
      name:{
        required: 'Su nombre es requerido'
      },
      surname:{
        required: 'Su apellido es requerido'
      }
    };

    this.genericValidator = new GenericValidatorDirective(this.validationMessages);
  }

  ngOnInit() {
    let token = localStorage.getItem('auth_token');
        if(!!token) this.router.navigate(['/home']); 
    this.registerForm = this.modelCreate();
  }


  ngAfterViewInit(){
    let controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

  Observable.merge(this.registerForm.valueChanges, ...controlBlurs)
    .takeUntil(this.ngUnsuscribe)
    .subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.registerForm);
    })
  }
  
  onSubmit(){
    if(this.registerForm.invalid){
      return;
    }
    if(!(this.password.value == this.confirmPassword.value)){
      this.anotherError = true;
      this.descrAnotherError = "Las contraseñas no coinciden"
      return;
    }
    let user = new User();
    user.email = this.email.value;
    user.first_name = this.name.value;
    user.last_name = this.surname.value;
    user.password = this.password.value;
    user.pictureUrl = this.profileUrlPhoto;

    this._registerService.newAccount(user)  
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        this.anotherError = true;
        if(err.code == 'auth/weak-password'){
          this.descrAnotherError = "La contraseña debe tener al menos 6 caracteres";
        }
        if(err.code == 'auth/email-already-in-use'){
          this.descrAnotherError = "Este email ya se encuentra en uso"
        }
      })
    
  }

  myUploader(event){
    this.blockUI.start('Cargando foto..')
    const file = event.files[0];
    const filePath = 'user/profilePhoto/'+this.email.value;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);

    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = ref.getDownloadURL()
        .subscribe((res) => {
          this.profileUrlPhoto = res;
          this.blockUI.stop();
        }) )
   ).subscribe((res) => {
     console.log(res);
   })
  }

  modelCreate(){
    return this.fb.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

}
