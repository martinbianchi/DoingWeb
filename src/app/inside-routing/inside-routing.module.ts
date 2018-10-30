import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { AuthService as RoleGuard } from '../services/auth.service';
import { InsideRoutingComponent } from './inside-routing.component';
import { UppercaseDirective } from '../shared/directives/uppercase.directive';
import { TasksComponent } from '../tasks/tasks.component';
import { TaskAbmComponent } from '../task-abm/task-abm.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { EventsComponent } from '../events/events.component';
import { FullCalendarModule } from 'ng-fullcalendar';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import { HabitsComponent } from '../habits/habits.component';
import { HabitsAbmComponent } from '../habits-abm/habits-abm.component';
import { NotesComponent } from '../notes/notes.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ChartModule} from 'primeng/chart';
import { ChartsComponent } from '../charts/charts.component';
import {AccordionModule} from 'primeng/accordion';
import {TabViewModule} from 'primeng/tabview';

const insideRoutes: Routes = [
  {
    path: 'home',
    component: InsideRoutingComponent,
    canActivate: [RoleGuard],
    // data: {
    //   expectedRole: 'user'
    // },
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: HomeComponent,
      },
      {
        path:'tasks',
        component:TasksComponent,
      },
      {
        path:'tasks/new',
        component: TaskAbmComponent,
        data:{
          type: 'new'
        }
      },
      {
        path:'tasks/edit/:uid',
        component: TaskAbmComponent,
        data:{
          type: 'edit'
        }
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'habits',
        component: HabitsComponent
      },
      {
        path: 'habits/new',
        component: HabitsAbmComponent,
        data:{
          type: 'new'
        }
      },
      {
        path: 'habits/edit/:uid',
        component: HabitsAbmComponent,
        data:{
          type: 'edit'
        }
      },
      {
        path: 'notes',
        component: NotesComponent
      },
      {
        path: 'charts',
        component: ChartsComponent
      },
      {
        path: '**',
        redirectTo: 'index'
      },

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(insideRoutes),
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BlockUIModule,
    FullCalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ScrollPanelModule,
    ChartModule,
    AccordionModule,
    TabViewModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    UppercaseDirective,
    TasksComponent,
    TaskAbmComponent,
    EventsComponent,
    HabitsComponent,
    HabitsAbmComponent,
    NotesComponent,
    ChartsComponent,

  ]
})
export class InsideRoutingModule { }
