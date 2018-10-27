import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventsService } from '../services/events.service';
import { Event } from 'src/app/models/Event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/Category';

declare var $: any;
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterViewInit {

  isUpdate = false;
  newEvent = new Event();
  eventForm: FormGroup;
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  events = [];
  categories = [];
  calendarOptions: Options
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  constructor(
    private fb: FormBuilder,
    private _eventsService : EventsService,
    private _toastrManager : ToastrManager,
    private _categoriesService: CategoriesService
  ) { }

  get date() { return this.eventForm.get('date'); }
  get id() { return this.eventForm.get('id'); }
  get title() { return this.eventForm.get('title'); }
  get color() { return this.eventForm.get('color'); }
  get description() { return this.eventForm.get('description'); }
  get category() { return this.eventForm.get('category'); }

  ngOnInit() {
    this.eventForm = this.modelCreate();
    this.blockUI.start('Cargando..');
    this._categoriesService.getAll()
    .then((res) => {
      res.forEach((el,index) => {
        let category = new Category();
        category = el.payload.val();
        category.Id = res[index].key;
        
        this.categories.push(category);
      })
    });

    this._eventsService.getAll()
      .then((res => {
        this.mapEvents(res);
        this.calendarOptions = {
          editable: true,
          eventLimit: false,
          height: 600 ,
          locale: 'es',
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
          },
          buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista'
          },
          
          monthNames: this.monthNames,
          selectable: true,
          events: this.events
          };
        this.blockUI.stop();
      }));

  }
  clearEvents() {
    this.events = [];
  }
  loadEvents() {
    this._eventsService.getAll().then(data => {
      this.mapEvents(data);
    });
  }
  eventRender(eventObj, el) {
    console.log(el);
    console.log(eventObj);
    $(eventObj.element).popover({
      title: eventObj.event.title,
      content: eventObj.event.description,
      trigger: 'hover',
      placement: 'top',
      container: 'body'
    });
  }
  mapEvents(res){
    this.events = [];
    res.forEach((element, index) => {
      let event = new Event();
      event = element.payload.val();
      event.Id = res[index].key;
      let el = {
        id: event.Id,
        description: event.Description,
        start: event.DateStart,
        end: event.DateFinish,
        title: event.Name,
        categoryId: event.CategoryId,
        categoryName: event.CategoryName,
        backgroundColor: event.Color,
        borderColor: event.Color,
        allDay: false
      };
      this.events.push(el);
      console.log(element.payload.val());

    });
  }
  ngAfterViewInit(){
   //this.scriptCalendar();
  }

  eventClick(model: any) {

    this.isUpdate = true;
    this.id.patchValue(model.event.id);
    this.description.patchValue(model.event.description);
    this.title.patchValue(model.event.title);
    let date = [];
    date[0] = model.event.start != null ? model.event.start.format() : null;
    date[1] = model.event.end != null ? model.event.end.format() : null
    this.date.patchValue(date);
    this.color.patchValue(model.event.backgroundColor);
    this.category.patchValue(model.event.categoryId);

   // this.displayEvent = model;
  }
  updateEvent(model: any) {
    this.blockUI.start();
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        categoryId: model.event.categoryId
        // other params
      },
      duration: {
        _data: model.duration._data
      }
    }
    let ev = new Event();
      ev.Name = model.event.title;
      ev.DateStart = model.event.start.format();
      ev.DateFinish= model.event.end != null ? model.event.end.format() : null;
      ev.Id = model.event.id;
      ev.CategoryId = model.event.categoryId;
      ev.CategoryName = model.event.categoryName;
    
      this._eventsService.update(ev)
        .then(() => {
          this.blockUI.stop();
        })
    this.isUpdate = false;
  }

  setColor(color){
    this.color.patchValue(color);
  }

  modelCreate(){
    return this.fb.group({
      id: '',
      title: ['', Validators.required],
      color: ['#0073b7', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  onSubmit(){
    this.blockUI.start('Guardando Evento');
    this.newEvent.Color = this.color.value == null ? "#0073b7" : this.color.value;

    this.newEvent.Name = this.title.value;
    this.newEvent.Description = this.description.value;
    this.newEvent.CategoryId = this.category.value;
    this.newEvent.CategoryName = this.categories.find(x => x.Id == this.category.value).name;

    if(!(this.id.value == '' || this.id.value == null)){
      this.newEvent.Id = this.id.value;
      this.newEvent.DateFinish = this.date.value[1];
      this.newEvent.DateStart = this.date.value[0];
      this._eventsService.update(this.newEvent)
        .then(() => {
          this.blockUI.stop();
          this.loadEvents();
        })
    }else{
      this.newEvent.DateFinish = this.date.value[1].toISOString();
      this.newEvent.DateStart = this.date.value[0].toISOString();
      this._eventsService.add(this.newEvent)
        .then(() => {
          this.blockUI.stop();
          this.loadEvents();
        })
    }
    this.isUpdate = false;
    this.eventForm.reset();
  }

  delete(){
    this.blockUI.start('Eliminando..');
    this._eventsService.delete(this.id.value)
      .then(() => {
        this._toastrManager.errorToastr('El evento se elimino satisfactoriamente', 'Evento eliminado', {
          position: 'bottom-right'
        });
        this.isUpdate = false;
        this.blockUI.stop();
        this.loadEvents();
        this.eventForm.reset();
      })
  }
}
