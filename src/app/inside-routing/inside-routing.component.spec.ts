import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideRoutingComponent } from './inside-routing.component';

describe('InsideRoutingComponent', () => {
  let component: InsideRoutingComponent;
  let fixture: ComponentFixture<InsideRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsideRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsideRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
