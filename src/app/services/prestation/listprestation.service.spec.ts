import { TestBed } from '@angular/core/testing';

import { ListprestationService } from './listprestation.service';

describe('ListprestationService', () => {
  let service: ListprestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListprestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
