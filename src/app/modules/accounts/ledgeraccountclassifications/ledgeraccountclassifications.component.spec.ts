import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgeraccountclassificationsComponent } from './ledgeraccountclassifications.component';

describe('LedgeraccountclassificationsComponent', () => {
  let component: LedgeraccountclassificationsComponent;
  let fixture: ComponentFixture<LedgeraccountclassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgeraccountclassificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgeraccountclassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
