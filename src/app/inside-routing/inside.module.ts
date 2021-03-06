import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { InsideRoutingModule } from './inside-routing.module';
import { BlockUIModule } from 'ng-block-ui';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule, MultiSelectModule, ChartModule } from 'primeng/primeng';
import { ErrorsModule } from '../core/errors';
import { InsideRoutingComponent } from './inside-routing.component';
import { HeaderComponent } from '../starter/header/header.component';
import { HomeComponent } from '../home/home.component';
import { SidebarComponent } from '../starter/sidebar/sidebar.component';
import { FooterComponent } from '../starter/footer/footer.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';

@NgModule({
  imports: [
    CommonModule,
    InsideRoutingModule,
    BlockUIModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    ScrollPanelModule,
    ChartModule
  ],
  declarations: [
  InsideRoutingComponent,
  HeaderComponent,
  HomeComponent,  
  SidebarComponent,
  FooterComponent,
  ]
})
export class InsideModule {}