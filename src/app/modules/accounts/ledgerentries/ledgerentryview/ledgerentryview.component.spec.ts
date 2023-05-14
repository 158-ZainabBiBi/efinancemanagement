import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerentryviewComponent } from './ledgerentryview.component';

describe('LedgerentryviewComponent', () => {
  let component: LedgerentryviewComponent;
  let fixture: ComponentFixture<LedgerentryviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerentryviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerentryviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
