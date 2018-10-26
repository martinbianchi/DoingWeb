import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { LoginService } from '../../services/login.service';
declare function require(path: string);

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private _loginService: LoginService) { }
  userLoged: User;
  ngOnInit() {
    this._loginService.userLoged$
    .subscribe((val: User)=>{        
        if(val){
          this.userLoged = val;
            if(this.userLoged.pictureUrl == ""){
              this.userLoged.pictureUrl = require('../../icons8-customer-64.png');
            }

        }
    });
  }

}
