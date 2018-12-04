import { Component, OnInit } from '@angular/core';
import { HabitsService } from '../services/habits.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Habits } from '../models/Habits';
import { ToastrManager } from 'ng6-toastr-notifications';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  myhabits = []
  dueHabits;
  constructor(
    private _habitsService: HabitsService,
    private _toastrManager: ToastrManager
  ) { }

  ngOnInit() {
    this.blockUI.start('Cargando..');

    this._habitsService.getAll()
      .then((res => {
        this.dueHabits = [];
        res.forEach((element, index) => {
          console.log(element.payload.val())
          let today = new Date();
          let habit = new Habits();
          habit = element.payload.val();
          habit.Id = res[index].key;
          if(!habit.Finished){
            if(habit.FinishDate != null){     
              //Si tiene fecha de finalización, valido que no este vencido.     
              let finishDate = new Date(habit.FinishDate);
              let lastdatedone = new Date(habit.LastDateDone);

              
              if((finishDate.getTime()) < (today.getTime())){
                //Si está vencido, calculo la cantidad de días a sumar al strike
                //y guardo el habit en otro array que actualizo cuando updateo cualquiera de los otros.
                let dueDays = this.daysDifference(finishDate, lastdatedone);

                habit.Strike += (Math.trunc(dueDays));
                habit.Finished = true;
                this.dueHabits.push(habit);
              }
              else{
                this.myhabits.push(habit);
              }
            }else{
              this.myhabits.push(habit);
            }
            
            if(new Date(habit.LastDateDone).getFullYear() == today.getFullYear() && new Date(habit.LastDateDone).getMonth() == today.getMonth() && new Date(habit.LastDateDone).getDay() == today.getDay()){
              habit.isDisabled = true;
            }else{
              habit.isDisabled = false;
            }
          }
        });
        this.blockUI.stop();
      }));
  }

  deleteHabit(id){
    Swal({
      title: 'Eliminar hábito?',
      text: 'Se eliminará y se perderá todo registro del mismo!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar!',
      cancelButtonText: 'No, volver'
    }).then((result) => { 
      if (result.value) {
        let i = this.myhabits.findIndex(e => e.Id == id);
        this.myhabits.splice(i,1);
        this._habitsService.remove(id)
          .then(() => {
            this._toastrManager.successToastr('El habito se elimino correctamente', "Habito eliminado", {
              position: 'bottom-right'
            })
          })
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }
    })
  }


  finishHabit(id){
    Swal({
      title: 'Finalizar hábito?',
      text: 'Se cerrará y no tendra mas acceso a seguir completandolo!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar!',
      cancelButtonText: 'No, volver'
    }).then((result) => {
      if (result.value) {
        let i = this.myhabits.findIndex(e => e.Id == id);
        this.myhabits.splice(i,1);
        this._habitsService.finishHabit(id)
          .then(() => {
            this._toastrManager.successToastr('El habito se finalizo correctamente', "Habito finalizado", {
              position: 'bottom-right'
            })
          })
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }
    })
  }

  checkValue(dayStrike, id){
    this.blockUI.start();
    let finished = false;
    let i = this.myhabits.findIndex(e => e.Id == id);
    let daysWithoutMarkAsDone = this.daysDifference(new Date(), new Date(this.myhabits[i].LastDateDone));
    let strikes = this.myhabits[i].Strike;
    if(this.myhabits[i].FinishDate != null){
      let daysToFinish = this.daysDifference(new Date(this.myhabits[i].FinishDate), new Date(this.myhabits[i].LastDateDone));

      // if(daysToFinish < 0){
      //   //Due habit!! --> Set finished true and increment strike in finishdate-lastdatedone
      //   let diference = this.daysDifference(new Date(this.myhabits[i].FinishDate), new Date(this.myhabits[i].LastDateDone));
      //   let daysUncompleted =diference + this.myhabits[i].Strike;
      //   this._habitsService.finishHabit(daysUncompleted, id)
      //     .then(() => {
      //       this._toastrManager.warningToastr('Se ha finalizado el habito', 'Habito caducado', {
      //         position: 'bottom-right'
      //       });
      //     })
      //}else {
          if(daysToFinish == 0){
            finished = true;
          }
        }
        if(daysWithoutMarkAsDone >= 2){
          strikes += (Math.trunc(daysWithoutMarkAsDone) - 1);
        }
        this._habitsService.updateDayStrike(dayStrike+1, id, finished, strikes)
        .then(() => {
          if(this.dueHabits.length > 0){
            this._habitsService.updateDueHabits(this.dueHabits)
            .then(()=> {
              console.log("Habitos actualizados")
              this.myhabits[i].DayStrike += 1;
              this.myhabits[i].isDisabled = true;
              this.blockUI.stop();
              let message;
              let title;
                message ='Has completado el habito el día de hoy';
                title = 'Felicitaciones!'
              this._toastrManager.infoToastr(message, title,{
                position: 'bottom-right'
              });
            });
          }
          else{
            this.myhabits[i].DayStrike += 1;
            this.myhabits[i].isDisabled = true;
            this.blockUI.stop();
            let message;
            let title;
              message ='Has completado el habito el día de hoy';
              title = 'Felicitaciones!'
            this._toastrManager.infoToastr(message, title,{
              position: 'bottom-right'
            });
          }


        })
      //}
    

  }

  daysDifference(date1, date2){
    let millisecondsPerDay = 1000 * 60 * 60 * 24;
    let millisBetween = date1.getTime() - date2.getTime();
    return millisBetween / millisecondsPerDay;
  }

}
