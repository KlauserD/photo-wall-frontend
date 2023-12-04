import { TestBed } from '@angular/core/testing';

import { PdfPageService } from './pdf-page.service';

describe('PdfService', () => {
  let service: PdfPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
