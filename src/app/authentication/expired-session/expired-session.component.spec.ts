import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredSessionComponent } from './expired-session.component';

describe('ExpiredSessionComponent', () => {
  let component: ExpiredSessionComponent;
  let fixture: ComponentFixture<ExpiredSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpiredSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
