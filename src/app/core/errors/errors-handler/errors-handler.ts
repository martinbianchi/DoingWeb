
import { ErrorHandler, Injectable, Injector, ViewContainerRef} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

//import * as StackTraceParser from 'error-stack-parser';

import { ErrorsService } from '../errors-service/errors.service';
import { NotificationService } from '../../../services/notification.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ErrorsHandler 
//implements ErrorHandler 
{
  constructor(
    private injector: Injector,
  ) {}
  
  handleError(error) {
     const notificationService = this.injector.get(NotificationService);
    const errorsService = this.injector.get(ErrorsService);
    const router = this.injector.get(Router);
    const toastManager = this.injector.get(ToastrManager);
    
    
    if (error instanceof HttpErrorResponse) {      
     // Server error happened     
      if (!navigator.onLine) {
        // No Internet connection
         toastManager.warningToastr('No Internet Connection','Error',{
           position: 'bottom-right'
         });
      }
      // Http Error
      // Send the error to the server
      if(error.status == 500){
        toastManager.errorToastr('Something went wrong, Internal server error!','Oops. :(', {
          position: "bottom-right"
        });
      }
      if(error.status == 400){
        toastManager.errorToastr(error.error, 'Algo salio mal', {
          position: "bottom-right"
        });
      }
      if(error.status == 404){
        router.navigate(['/home']);
      }

      if(error.status == 402){
        router.navigate(['/home']);
      }

      if (error.status == 400) {
        router.navigate(['/home']);
      }
      //errorsService.log(error).subscribe();

      // Show notification to the user
      //return notificationService.notify(`${error.status} - ${error.message}`);
    } else {
      // Client Error Happend
      // Send the error to the server and then
      // redirect the user to the page with all the info
      // errorsService
      //     .log(error)
      //     .subscribe(errorWithContextInfo => {
      //       router.navigate(['/error'], { queryParams: errorWithContextInfo });
      //   });
    }
  }


}

