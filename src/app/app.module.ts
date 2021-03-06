import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRouteModule } from './app-route.module';
import { InsideModule } from './inside-routing/inside.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BlockUIModule } from 'ng-block-ui';

import { ErrorsModule } from './core/errors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ToastrModule } from 'ng6-toastr-notifications';

import { CommonModule } from '@angular/common';
import { ErrorLoginComponent } from './error-login/error-login.component';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { RegisterComponent } from './register/register.component';
import {FileUploadModule} from 'primeng/fileupload';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorLoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    InsideModule,
    ErrorsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRouteModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'doing-backend'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FileUploadModule,
    AngularFireStorageModule,
    BlockUIModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
