import { TestBed } from '@angular/core/testing';

import { RefreshTimeService } from './refresh-time.service';

describe('RefreshTimeService', () => {
  let service: RefreshTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
