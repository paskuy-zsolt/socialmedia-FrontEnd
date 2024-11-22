import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLoaderComponent } from './users-loader.component';

describe('UsersLoaderComponent', () => {
  let component: UsersLoaderComponent;
  let fixture: ComponentFixture<UsersLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
