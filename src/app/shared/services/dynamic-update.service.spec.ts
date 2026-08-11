import { TestBed } from '@angular/core/testing';

import { DynamicUpdateService } from './dynamic-update.service';

describe('DynamicUpdateService', () => {
  let service: DynamicUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
