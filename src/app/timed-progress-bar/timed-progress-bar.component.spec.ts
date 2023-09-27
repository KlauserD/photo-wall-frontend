import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedProgressBarComponent } from './timed-progress-bar.component';

describe('TimedProgressBarComponent', () => {
  let component: TimedProgressBarComponent;
  let fixture: ComponentFixture<TimedProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimedProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimedProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
