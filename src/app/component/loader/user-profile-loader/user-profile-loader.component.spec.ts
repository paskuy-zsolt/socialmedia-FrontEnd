import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileLoaderComponent } from './user-profile-loader.component';

describe('UserProfileLoaderComponent', () => {
  let component: UserProfileLoaderComponent;
  let fixture: ComponentFixture<UserProfileLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProfileLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
