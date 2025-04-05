import { TestBed } from '@angular/core/testing';

import { StockpieceService } from './stockpiece.service';

describe('StockpieceService', () => {
  let service: StockpieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockpieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
