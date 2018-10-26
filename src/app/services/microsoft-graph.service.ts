import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MicrosoftGraphService {
  private authWindow: Window;
  private redirectUri = environment.BASE_URL + "/assets/microsoft-graph-auth.html";
  private appId = environment.APP_ID;

  constructor() { }

  login(){
    var url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id='+this.appId+'&response_type=code&redirect_uri='+this.redirectUri+'&response_mode=query&scope=offline_access%20user.read&state=12345';
    var w = 600;
    var h = 400;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    //this.authWindow = window.open(url, null);
      this.authWindow = window.open(url, null,'width='+w+',height='+h+',top='+top+',left='+left);
  }
  closeWindow(){
    if(this.authWindow)
    this.authWindow.close();
  }

}
