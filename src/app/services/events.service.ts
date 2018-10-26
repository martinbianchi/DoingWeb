import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginService } from 'src/app/services/login.service';
import { Event } from 'src/app/models/Event';
import { EventEmitter } from '@angular/core/src/event_emitter';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  user;
  itemsRef;

  constructor(
    private _db: AngularFireDatabase,
    private _loginService: LoginService
  ) {
    this.user = this._loginService.getUserLoged();
   }

  getAll(){
    return new Promise<any[]>((resolve, reject)=>{
      this._db.list("/events", ref =>
      ref.child(this.user.id))
          .snapshotChanges()
          .subscribe((actions)=>
          {
            resolve(actions);
          },
          error => reject(error));
     })
  }

  update(ev){
      return this._db.list('/events/'+this.user.id).update(ev.Id, ev)
  }

  add(ev){
    return this._db.list('/events/'+this.user.id).push(ev);
  }
  delete(id){
    return this._db.list('/events/'+this.user.id).remove(id);
  }
}
