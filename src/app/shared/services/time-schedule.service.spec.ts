import { TestBed } from '@angular/core/testing';

import { TimeScheduleService } from './time-schedule.service';

describe('TimeScheduleService', () => {
  let service: TimeScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
