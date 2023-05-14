import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournallineviewComponent } from './journallineview.component';

describe('JournallineviewComponent', () => {
  let component: JournallineviewComponent;
  let fixture: ComponentFixture<JournallineviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournallineviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournallineviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
