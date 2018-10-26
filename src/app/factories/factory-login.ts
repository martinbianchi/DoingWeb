import { IUserServices } from '../interfaces/IUserServices';
import { GoogleService } from '../services/google.service';
import { Injectable } from '@angular/core';
import { FacebookService } from '../services/facebook.service';
import { MicrosoftGraphService} from '../services/microsoft-graph.service';

export enum LoginKind{
    Gmail,
    Facebook,
    Microsoft
}

@Injectable({
    providedIn: 'root'
  })
export class FactoryLogin {

    constructor(private google: GoogleService,
                private facebook: FacebookService,
                private msft: MicrosoftGraphService){ }

    createLogin(kind:LoginKind) : IUserServices{
        switch(kind){
            case LoginKind.Gmail:
                return this.google;
            case LoginKind.Facebook:
                return this.facebook;
            case LoginKind.Microsoft:
                return this.msft;
        }
    }


}
