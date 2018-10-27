import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private _db: AngularFireDatabase,
  ) { }

  getAll(){
    return new Promise<any[]>((resolve, reject)=>{
      this._db.list("/categories")
          .snapshotChanges()
          .subscribe((actions)=>
          {
            resolve(actions);
          },
          error => reject(error));
     })

  }
}
