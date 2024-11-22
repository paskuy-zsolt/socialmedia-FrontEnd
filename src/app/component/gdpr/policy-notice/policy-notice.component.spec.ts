import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNoticeComponent } from './policy-notice.component';

describe('PolicyNoticeComponent', () => {
  let component: PolicyNoticeComponent;
  let fixture: ComponentFixture<PolicyNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyNoticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolicyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
