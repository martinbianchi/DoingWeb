import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { tap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/retry';

import { ErrorsService } from '../errors-service/errors.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ServerErrorsInterceptor 
//implements HttpInterceptor 
{
  constructor(
    private router: Router,
    private errorsService: ErrorsService,
    private toastManager: ToastrManager
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let url = request.url.split('/');
    if(url[2] == 'auth' || url[1] == 'externalauth'){
      return next.handle(request)
        .pipe(
          tap(event => {
            if(event instanceof HttpResponse){
              
            }
          }, error => {
            if(error.status == 511){
              this.router.navigate(['/login-error']);
            }
            else{
              this.toastManager.errorToastr(error.error, 'Error', {
                position: 'bottom-right',
                dismiss: 'click',
                showCloseButton: true
              });
            }
            
          })
        )
    }
    return next.handle(request)
  }
}
