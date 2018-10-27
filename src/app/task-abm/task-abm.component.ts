import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { Task } from 'src/app/models/Task';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Category } from 'src/app/models/Category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-task-abm',
  templateUrl: './task-abm.component.html',
  styleUrls: ['./task-abm.component.css']
})
export class TaskAbmComponent implements OnInit {

  isCreate: boolean;
  taskForm: FormGroup;

  categories =[];

  constructor(
    private fb: FormBuilder,
    private taskService: TasksService,
    private router: Router,
    private _route: ActivatedRoute,
    private _categoriesService: CategoriesService,
    private _toastrManager: ToastrManager
  ) { }

  typeForm;
  task = new Task();
  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  get description() { return this.taskForm.get('description'); }
  get duedate() { return this.taskForm.get('duedate'); }
  get priority() { return this.taskForm.get('priority'); }
  get category() { return this.taskForm.get('category');}

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
    this.taskForm = this.modelCreate();
    this._categoriesService.getAll()
    .then((res) => {
      res.forEach((el,index) => {
        let category = new Category();
        category = el.payload.val();
        category.Id = res[index].key;
        
        this.categories.push(category);
      })
    });
  }
  ngAfterViewInit(){
    if(this.typeForm == 'edit'){
      this._route.params.subscribe((p) => {
        this.task.Id = p.uid;
        this.taskService.getOne(this.task.Id)
          .then((res) => {
            this.description.patchValue(res.val().Description);
            this.duedate.patchValue(res.val().DueDate);
            this.priority.patchValue(res.val().Priority);
            this.category.patchValue(res.val().CategoryId);
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
      duedate: ['', Validators.required],
      priority: ['1', Validators.required],
      category: ['', Validators.required]
    });
  }

  onSubmit(){   
    
    this.task.Description = this.description.value;
    this.task.DueDate = this.duedate.value;
    this.task.Priority = this.priority.value;
    this.task.isExpired = false;
    this.task.Done = false;
    this.task.CategoryId = this.category.value;
    this.task.CategoryName = this.categories.find(x => x.Id == this.category.value).name;
    if(this.typeForm == 'new'){
      this.taskService.addOne(this.task)
      .then((res) => {
        this.router.navigate(['/home/tasks']);
        this._toastrManager.successToastr('La tarea se añadio correctamente', 'Tarea Añadida!',{
          position: "bottom-right"
        })
      });
    }else{
      this.taskService.update(this.task)
        .then(() => {
          this.router.navigate(['/home/tasks']);
          this._toastrManager.successToastr('La tarea se edito correctamente', 'Tarea Editada!',{
            position: "bottom-right"
          });
        })
    }


  }

  goBack(){
    this.router.navigate(['/home/tasks']);
  }
}
