import { TestBed } from '@angular/core/testing';

import { ZdFsjService } from './zd-fsj.service';

describe('ZdFsjService', () => {
  let service: ZdFsjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZdFsjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
