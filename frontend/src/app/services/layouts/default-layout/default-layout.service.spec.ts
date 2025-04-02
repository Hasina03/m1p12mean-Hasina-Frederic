import { TestBed } from '@angular/core/testing';

import { DefaultLayoutService } from './default-layout.service';

describe('DefaultLayoutService', () => {
  let service: DefaultLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
