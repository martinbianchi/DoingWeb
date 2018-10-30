import { Component, OnInit } from '@angular/core';
import { HabitsService } from 'src/app/services/habits.service';
import { Habits } from 'src/app/models/Habits';
import { BlockUI, NgBlockUI } from 'ng-block-ui'; 

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private _habitsService: HabitsService
  ) { }

  allHabits = [];
  habitsInProgress = [];
  habitsFinished = [];

  AHBestDayStrike;
  AHBestStrike;
  PHBestDayStrike;
  PHBestStrike;
  FHBestDayStrike;
  FHBestStrike;

  dataPiePH;
  optionsPiePH;

  dataPieFH;
  optionsPieFH;

  dataPieAH;
  optionsPieAH;

  dataDoughnout;
  optionsDoughnout;

  ngOnInit() {
    this.blockUI.start("Estamos preparando sus reportes...");
    this._habitsService.getAll()
      .then((res) => {
        res.forEach((element, index) => {
          let habit = new Habits();
          habit = element.payload.val();
          habit.Id = res[index].key;
          this.allHabits.push(habit);
          if(habit.Finished){
            this.habitsFinished.push(habit);
          } else{
            this.habitsInProgress.push(habit);
          }
          console.log(element.payload.val());
          
        });
        this.generateAllHabitsCharts();
        this.generateInProgressHabitsCharts();
        this.generateFinishedHabitsCharts();

        window.setTimeout(()=> {
          this.blockUI.stop();
        }, 2000);
      })
  }

  generateAllHabitsCharts(){
    this.AHBestDayStrike = this.calculateBestDayStrike(this.allHabits);
    this.AHBestStrike  = this.calculateBestStrike(this.allHabits);

    this.generatePieChartAH(['Cantidad de días que cumplió', 'Cantidad de días que no cumplió'], [this.AHBestDayStrike.sum, this.AHBestStrike.sum], "Comparación de cumplimientos");
    this.generateDoughnoutChart();
  }

  generateInProgressHabitsCharts(){
    this.PHBestDayStrike = this.calculateBestDayStrike(this.habitsInProgress);
    this.PHBestStrike  = this.calculateBestStrike(this.habitsInProgress);

    this.generatePieChartPH(['Cantidad de días que cumplió', 'Cantidad de días que no cumplió'], [this.PHBestDayStrike.sum, this.PHBestStrike.sum], "Comparación de cumplimientos");
  }

  generateFinishedHabitsCharts(){
    this.FHBestDayStrike = this.calculateBestDayStrike(this.habitsFinished);
    this.FHBestStrike  = this.calculateBestStrike(this.habitsFinished);

    this.generatePieChartFH(['Cantidad de días que cumplió', 'Cantidad de días que no cumplió'], [this.FHBestDayStrike.sum, this.FHBestStrike.sum], "Comparación de cumplimientos");
  }

  calculateBestDayStrike(habits :Habits[]){
    let max = 0;
    let sum = 0;
    let descr;
    habits.forEach((el,ind) => {
      if(el.DayStrike >= max){
        max = el.DayStrike;
        descr = el.Description;
      }
      sum += el.DayStrike;
    })

    return {dayStrike : max, name: descr, sum: sum};
  }

  calculateBestStrike(habits: Habits[]){
    let max = 0;
    let sum = 0;
    let descr;
    habits.forEach((el,ind) => {
      if(el.Strike >= max){
        max = el.DayStrike;
        descr = el.Description;
      }
      sum += el.Strike;
    });

    return {dayStrike : max, name: descr, sum: sum};
  }

  generatePieChartPH(labels2, values, title){
     this.dataPiePH = {
      labels: labels2,
      datasets: [
          {
              data: values,
              backgroundColor: [
                  "#FF6384",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#FFCE56"
              ]
          }]    
      };
    this.optionsPiePH = {
      title: {
        display: true,
        text: title,
        fontSize: 16
    }
    };

  }

  generatePieChartFH(labels2, values, title){
    this.dataPieFH = {
     labels: labels2,
     datasets: [
         {
             data: values,
             backgroundColor: [
                 "#FF6384",
                 "#FFCE56"
             ],
             hoverBackgroundColor: [
                 "#FF6384",
                 "#FFCE56"
             ]
         }]    
     };
   this.optionsPieFH = {
     title: {
       display: true,
       text: title,
       fontSize: 16
   }
  };
 }
 generatePieChartAH(labels2, values, title){
  this.dataPieAH = {
   labels: labels2,
   datasets: [
       {
           data: values,
           backgroundColor: [
               "#FF6384",
               "#FFCE56"
           ],
           hoverBackgroundColor: [
               "#FF6384",
               "#FFCE56"
           ]
       }]    
   };
 this.optionsPieAH = {
   title: {
     display: true,
     text: title,
     fontSize: 16
  }
  };
}

  generateDoughnoutChart(){
    this.dataDoughnout = {
      labels: ['Hábitos en curso','Hábitos finalizados'],
      datasets: [
          {
              data: [this.habitsInProgress.length, this.habitsFinished.length],
              backgroundColor: [
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]    
      };
    this.optionsDoughnout = {
      title: {
        display: true,
        text: 'Estado actual',
        fontSize: 16
    }
    }
  }
}
