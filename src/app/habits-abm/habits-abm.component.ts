import { Component, OnInit,  ViewChildren, ElementRef  } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { HabitsService } from '../services/habits.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Habits } from '../models/Habits';

@Component({
  selector: 'app-habits-abm',
  templateUrl: './habits-abm.component.html',
  styleUrls: ['./habits-abm.component.css']
})
export class HabitsAbmComponent implements OnInit {
  withFinishDate
  isCreate: boolean;
  habitForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _habitsService: HabitsService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastrManager: ToastrManager
  ) {
    this.withFinishDate = false;
   }

  typeForm;
  habit = new Habits();
  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  get description() { return this.habitForm.get('description'); }
  get finishDate() { return this.habitForm.get('finishDate'); }

  ngOnInit() {
    this.blockUI.start();
    this._route.data.subscribe((da) => {
      this.typeForm = da.type;
      if(da.type == 'new'){
        this.isCreate = true;
      }
      else{
        this.isCreate = false;
      }
    });
    this.habitForm = this.modelCreate();
  }

  ngAfterViewInit(){
    if(this.typeForm == 'edit'){
      this._route.params.subscribe((p) => {
        this.habit.Id = p.uid;
        this._habitsService.getOne(this.habit.Id)
          .then((res) => {
            console.log(res.val());
            let date = res.val().FinishDate;
            this.description.patchValue(res.val().Description);
            if(date != null){
              this.finishDate.patchValue(date);
              this.withFinishDate =true;
            }
            this.blockUI.stop();
          })
      })
    }else{
      this.blockUI.stop();
    }
  }

  modelCreate(){
    return this.fb.group({
      description: ['', Validators.required],
      finishDate: ''
    });
  }

  checkValue(){
    this.withFinishDate = !this.withFinishDate;
  }

  onSubmit(){   
    
    this.habit.Description = this.description.value;
    if(!this.withFinishDate){
      this.habit.FinishDate = null;
    }else{
      this.habit.FinishDate = this.finishDate.value;
    }
    if(this.typeForm == 'new'){
      this.habit.CreatedAt = new Date();
      this.habit.DayStrike = 1;
      this.habit.Strike = 0;
      this.habit.Finished = false;
      this.habit.isDisabled = false;
      this.habit.LastDateDone = new Date(); 
      this._habitsService.addOne(this.habit)
      .then((res) => {
        this._router.navigate(['/home/habits']);
        this._toastrManager.successToastr('La tarea se añadio correctamente', 'Tarea Añadida!',{
          position: "bottom-right"
        })
      });
    }else{
      this._habitsService.update(this.habit)
        .then(() => {
          this._router.navigate(['/home/habits']);
          this._toastrManager.successToastr('La tarea se edito correctamente', 'Tarea Editada!',{
            position: "bottom-right"
          });
        });
  } 
  }
}