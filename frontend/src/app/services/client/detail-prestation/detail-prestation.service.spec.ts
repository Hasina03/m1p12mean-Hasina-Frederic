import { TestBed } from '@angular/core/testing';

import { DetailPrestationService } from './detail-prestation.service';

describe('DetailPrestationService', () => {
  let service: DetailPrestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailPrestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
