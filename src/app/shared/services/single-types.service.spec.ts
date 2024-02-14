import { TestBed } from '@angular/core/testing';

import { SingleTypesService } from './single-types.service';

describe('SingleTypesService', () => {
  let service: SingleTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
