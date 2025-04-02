import { TestBed } from '@angular/core/testing';

import { SuiviPrestationService } from './suivi-prestation.service';

describe('SuiviPrestationService', () => {
  let service: SuiviPrestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviPrestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
