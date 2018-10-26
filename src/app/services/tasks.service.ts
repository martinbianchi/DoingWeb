import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database"; 
import { LoginService } from 'src/app/services/login.service';
import { Task } from 'src/app/models/Task';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
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
      this._db.list("/tasks", ref =>
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
     return this._db.list('/tasks/'+this.user.id+'/'+id).query.once('value');
   }

   addOne(task: Task){
     return this._db.list('/tasks/'+this.user.id).push(task);
   }

   update(task){
     return this._db.list('/tasks/'+this.user.id).update(task.Id, task)
   }

   updateDone(done, id){
     return this._db.list('/tasks/'+this.user.id).update(id, {Done: done});
   }

   remove(id){
     return this._db.list('/tasks/'+this.user.id).remove(id);
   }
}
