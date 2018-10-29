import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/models/Task';
import { EventsService } from 'src/app/services/events.service';
import { HabitsService } from 'src/app/services/habits.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showPie = false;
  showRadar = false;
  options;
  @BlockUI() blockUI: NgBlockUI;
  categories = ["Otros", "Deportes", "Productividad", "Entretenimiento", "Cuidado Personal", "Trabajo", "Estudios"];

  optionsPie = {
    title: {
      display: true,
      text: 'Estado de tareas activas',
      fontSize: 16
  }
  }
  tasksCategoriesUser;
  eventsCategoriesUser;
  habitsCategoriesUser;
  datapie;
  dataRadar;
  tasksCompleted = 0;
  tasksUncompleted=0;

  constructor(
    private _authService: AuthService,
    private _tasksService: TasksService,
    private _eventsService: EventsService,
    private _habitService: HabitsService
  ) { }
  role;
  ngOnInit() {
    this.blockUI.start('Cargando...');
    this.role = this._authService.getUserLogedRol();
    this._tasksService.getAll()
      .then((res) => {
        this.tasksCategoriesUser = this.countCategories(res);
        console.log(this.tasksCategoriesUser);
        res.forEach((element, index) => {
          let task = new Task();
          task = element.payload.val();
          if(!task.isExpired){
            if(task.Done){
              this.tasksCompleted +=1;
            }else{
              this.tasksUncompleted +=1;
            }
          }
          
        });
        if(this.tasksCompleted > 0 || this.tasksUncompleted > 0){
          this.showPie = true;
          this.datapie = {
            labels:['Tareas completadas', 'Tareas sin completar'],
            datasets:[
              {
                data:[this.tasksCompleted, this.tasksUncompleted],
                backgroundColor:[
                  "#7eff66",
                  "#ea3939"
                ],
                hoverBackgroundColor:[
                  "#7eff66",
                  "#ea3939"
                ]
              }
            ]};
        }

        console.log(this.tasksCompleted);console.log(this.tasksUncompleted);

        this._eventsService.getAll()
          .then((res) => {
            this.eventsCategoriesUser = this.countCategories(res);
            this._habitService.getAll()
              .then((res) => {
                this.habitsCategoriesUser = this.countCategories(res);

                this.initializeRadar();
                this.blockUI.stop();

                if((this.eventsCategoriesUser.length > 0) || (this.habitsCategoriesUser.length > 0) || (this.tasksCategoriesUser.length > 0)){
                  this.showRadar = true;
                }
                console.log(this.eventsCategoriesUser);
              })
          })
    });

  }

  initializeRadar(){
    let maxEvents = Math.max(...this.eventsCategoriesUser);
    let maxHabits = Math.max(...this.habitsCategoriesUser);
    let maxTasks = Math.max(...this.tasksCategoriesUser);
    let max = Math.max(maxEvents,maxHabits, maxTasks);

    let minEvents = Math.max(...this.eventsCategoriesUser);
    let minHabits = Math.max(...this.habitsCategoriesUser);
    let minTasks = Math.max(...this.tasksCategoriesUser);
    let minAux = Math.min(minEvents,minHabits, minTasks);

    //Para que el minimo pueda ser mayor que 1 pero en el caso que haya cero de minimo
    //no se vuelva negativo el label
    let min = Math.max((minAux-3), 0);

  
   console.log(max,min);
   
    this.options =
    {
      scale:{
        ticks:{
          beginAtZero: true,
          max: (max+1),
          min: min
        }
      },
      title: {
        display: true,
        text: 'Distribución de categorias',
        fontSize: 16
      }
    };
    
    this.dataRadar = {
      labels: this.categories,
      datasets:[
        {
          label: 'Tareas',
          backgroundColor: 'rgba(179,181,198,0.2)',
          borderColor: 'rgba(179,181,198,1)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)',
          data: this.tasksCategoriesUser
        },
        {
          label: 'Eventos',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          data: this.eventsCategoriesUser
      },
      {
        label: 'Habitos',
        backgroundColor: 'rgba(255,245,221,0.8)',
        borderColor: 'rgba(255,205,86,1)',
        pointBackgroundColor: 'rrgba(255,245,221,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,99,132,1)',
        data: this.habitsCategoriesUser
      }
      ]

    };
  }


  countCategories(data :any[]){
    let countOtros = 0;
    let countDeportes = 0;
    let countProductividad = 0;
    let countEntretenimiento = 0;
    let countCuidadPersonal = 0;
    let countTrabajo = 0;
    let countEstudios = 0;

    data.forEach((el,index) => {
      el = el.payload.val();
      switch(el.CategoryId){
        case "-LPrqxa_sUfFwz-R20rk":
          countOtros += 1;
          break;
        case "1lgSHzNXwwub8AcNF7yf":
          countDeportes += 1;
          break;
        case "AmHjJGlXh7tQcI5Tktq6":
          countProductividad +=1;
          break;
        case "YCSsHQ3v7IOYBMF7MVJV":
          countEntretenimiento +=1;
          break;
        case "gBJlWIGKNIfE7IIgwgVk":
          countCuidadPersonal += 1;
          break;
        case "oiUfBH9GsJRnXAe2RMJk":
          countTrabajo += 1;
          break;
        case "tmdqOW6ZOx5hWr9CJniU":
          countEstudios += 1;
          break;
      }
    });
    let cantTotal = [];
    return cantTotal = [ countOtros, countDeportes, countProductividad, countEntretenimiento, countCuidadPersonal, countTrabajo, countEstudios];
    //   {nameCat: "Otros", cant: countOtros},
    //   {nameCat: "Deportes", cant: countDeportes},
    //   {nameCat: "Productividad", cant: countProductividad},
    //   {nameCat: "Entretenimiento", cant: countEntretenimiento},
    //   {nameCat: "Cuidado Personal", cant: countCuidadPersonal},
    //   {nameCat: "Trabajo", cant: countTrabajo},
    //   {nameCat: "Estudios", cant: countEstudios}
    // ];

    
  }

}
