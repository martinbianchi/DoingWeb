import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginService } from 'src/app/services/login.service';
import { Note } from 'src/app/models/Note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

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
     this._db.list("/notes", ref =>
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
    return this._db.list('/notes/'+this.user.id+'/'+id).query.once('value');
  }

  addOne(note: Note){
    return this._db.list('/notes/'+this.user.id).push(note);
  }

  update(note){
    return this._db.list('/notes/'+this.user.id).update(note.Id, note)
  }

  updateDone(done, id){
    return this._db.list('/notes/'+this.user.id).update(id, {Done: done});
  }

  remove(id){
    return this._db.list('/notes/'+this.user.id).remove(id);
  }
}
