import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { Task } from '../models/Task';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private _taskService: TasksService,
    private router: Router,
    private _toastrManager: ToastrManager) { }

  private mytasks = [];
  ngOnInit() {
    this.blockUI.start('Cargando..');
    this._taskService.getAll()
      .then((res => {
        res.forEach((element, index) => {
          let task = new Task();
          task = element.payload.val();
          task.Id = res[index].key;
          this.mytasks.push(task);
          console.log(element.payload.val());

        });
        this.blockUI.stop();
      }));
  }

  newTask(){
    this.router.navigate(['/home/tasks/new']);
  }

  checkValue(done, id){
    //if done came true => we need to set Done = false (unchecked button)
    //If done came false => we need to set Done = true (checked button)
    this.blockUI.start();
    this._taskService.updateDone(!done,id)
      .then(() => {
        let i = this.mytasks.findIndex(e => e.Id == id);
        this.mytasks[i].Done = !done; 
        this.blockUI.stop();
        let message;
        let title;
        if(!done){
          message ='Has completado la tarea';
          title = 'Felicitaciones!'
        }
        else{
          message = 'La tarea esta ahora incompleta';
          title = 'Cambio de estado'
        }
        this._toastrManager.infoToastr(message, title,{
          position: 'bottom-right'
        });
      })
  }

  remove(id){
    this.blockUI.start();
    this._taskService.remove(id)
      .then(()=>{
        let i = this.mytasks.findIndex(e => e.Id == id);
        this.mytasks.splice(i,1);
        this.blockUI.stop();
        this._toastrManager.infoToastr('Se elimino correctamente', 'Tarea Eliminada',{
          position: 'bottom-right'
        });
      })
  }

}
