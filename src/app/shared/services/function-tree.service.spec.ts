import { TestBed } from '@angular/core/testing';

import { FunctionTreeService } from './function-tree.service';

describe('RoleService', () => {
  let service: FunctionTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunctionTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
