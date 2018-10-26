import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsAbmComponent } from './habits-abm.component';

describe('HabitsAbmComponent', () => {
  let component: HabitsAbmComponent;
  let fixture: ComponentFixture<HabitsAbmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsAbmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
