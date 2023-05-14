import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgeraccountviewComponent } from './ledgeraccountview.component';

describe('LedgeraccountviewComponent', () => {
  let component: LedgeraccountviewComponent;
  let fixture: ComponentFixture<LedgeraccountviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgeraccountviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgeraccountviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
