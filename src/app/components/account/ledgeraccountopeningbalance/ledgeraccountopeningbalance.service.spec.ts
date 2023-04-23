import { TestBed } from '@angular/core/testing';

import { LedgeraccountopeningbalanceService } from './ledgeraccountopeningbalance.service';

describe('LedgeraccountopeningbalanceService', () => {
  let service: LedgeraccountopeningbalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LedgeraccountopeningbalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
