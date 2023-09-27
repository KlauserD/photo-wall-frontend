import { TestBed } from '@angular/core/testing';

import { EmpPhotoCollectionService } from './emp-photo-collection.service';

describe('EmpPhotoCollectionService', () => {
  let service: EmpPhotoCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpPhotoCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
