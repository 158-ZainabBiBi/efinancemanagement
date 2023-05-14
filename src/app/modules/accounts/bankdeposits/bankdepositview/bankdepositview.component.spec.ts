import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankdepositviewComponent } from './bankdepositview.component';

describe('BankdepositviewComponent', () => {
  let component: BankdepositviewComponent;
  let fixture: ComponentFixture<BankdepositviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankdepositviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankdepositviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
