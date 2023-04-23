import { TestBed } from '@angular/core/testing';

import { JournalopeningbalanceService } from './journalopeningbalance.service';

describe('JournalopeningbalanceService', () => {
  let service: JournalopeningbalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalopeningbalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
