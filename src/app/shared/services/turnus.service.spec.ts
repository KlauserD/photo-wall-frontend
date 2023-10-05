import { TestBed } from '@angular/core/testing';

import { TurnusService } from './turnus.service';

describe('TurnusService', () => {
  let service: TurnusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
