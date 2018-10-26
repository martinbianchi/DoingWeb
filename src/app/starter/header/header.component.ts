import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../../models/User';
import { LoginService } from '../../services/login.service';
declare function require(path: string);
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
    private _loginService: LoginService) { }
    userLoged = new User();
  ngOnInit() {

    if (!$(".sidebar-mini").hasClass('sidebar-collapse')) {
      $('[data-toggle="push-menu"]').pushMenu('toggle');
    }

    this._loginService.userLoged$
        .subscribe((val: User)=>{        
            if(val){
              this.userLoged = val;

              if(this.userLoged.pictureUrl == null){
                this.userLoged.pictureUrl = require('../../icons8-customer-64.png');
              }
            }
            else{
              this.userLoged.pictureUrl = require('../../icons8-customer-64.png');

            }

        });
  }

  signout(){
    this._loginService.logout();
    this.router.navigate(['/login']);
  }

}
