import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAbmComponent } from './task-abm.component';

describe('TaskAbmComponent', () => {
  let component: TaskAbmComponent;
  let fixture: ComponentFixture<TaskAbmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAbmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
