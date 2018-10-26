import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Note } from 'src/app/models/Note';
import { ViewChildren } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  noteForm: FormGroup;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  get description() { return this.noteForm.get('description'); }
  get title() { return this.noteForm.get('title'); }



  constructor(
    private _notesService: NotesService,
    private fb: FormBuilder,
    private _toastrManager: ToastrManager
  ) { }

  modelCreate(){
    return this.fb.group({
      description: [''],
      title: ''
    });
  }
onSubmit(){
  let n = new Note();
  n.Title = this.title.value;
  n.Description = this.description.value;
  n.CreationDate = new Date();
  this.notes.push(n);

  this._notesService.addOne(n)
    .then(() => console.log("Añadida"));
    this.noteForm.reset();
}

  
  notes=[];

  ngOnInit() {
    this.noteForm = this.modelCreate();
    this.blockUI.start('Cargando..');
    this._notesService.getAll()
      .then((res => {
        res.forEach((element, index) => {
          let note = new Note();
          note = element.payload.val();
          note.Id = res[index].key;
          this.notes.push(note);
          console.log(element.payload.val());

        });
        this.blockUI.stop();
      }));
  }

  deleteNote(id){
    let i = this.notes.findIndex(e => e.Id == id);
    this.notes.splice(i,1);
    this._notesService.remove(id)
      .then(() => {
        this._toastrManager.successToastr('La nota se elimino correctamente','Nota eliminada',{
          position: 'bottom-right'
        })
      })
  }
}
