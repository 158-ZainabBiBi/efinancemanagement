import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktransferviewComponent } from './banktransferview.component';

describe('BanktransferviewComponent', () => {
  let component: BanktransferviewComponent;
  let fixture: ComponentFixture<BanktransferviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanktransferviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanktransferviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
