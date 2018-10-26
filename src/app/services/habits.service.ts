import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database"; 
import { LoginService } from 'src/app/services/login.service';
import { Observable } from 'rxjs/internal/Observable';
import { Habits } from '../models/Habits';

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

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
        this._db.list("/habits", ref =>
        ref.child(this.user.id))
            .snapshotChanges()
            .subscribe((actions)=>
            {
              resolve(actions);
            },
            error => reject(error));
       })
  
     }
     getOne(id){
       return this._db.list('/habits/'+this.user.id+'/'+id).query.once('value');
     }
  
     addOne(habits: Habits){
       return this._db.list('/habits/'+this.user.id).push(habits);
     }
  
     update(habits){
       return this._db.list('/habits/'+this.user.id).update(habits.Id, habits)
     }
  
     updateDayStrike(dayStrike, id, finished, strikes){
       return this._db.list('/habits/'+this.user.id).update(id, {DayStrike: dayStrike, LastDateDone: new Date(), Finished: finished, Strike:strikes});
     }

     updateDueHabits(dueHabits: any[]){
      var updatedUserData = {};
      dueHabits.forEach((element, index)=>{
      updatedUserData[element.Id] = element;
    });
       return this._db.object('habits/'+this.user.id).update(updatedUserData);
       //return Observable.forkJoin(observables);
     }

     finishHabit(id){
       return this._db.list('/habits/'+this.user.id).update(id, { Finished: true});
     }
  
     remove(id){
       return this._db.list('/habits/'+this.user.id).remove(id);
     }
  }
  


