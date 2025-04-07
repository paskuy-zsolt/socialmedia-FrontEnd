import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileUpdateComponent } from './user-profile-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../service/user/user.service';
import { AuthService } from '../../../../service/auth/auth.service';
import { SuccessMessageService } from '../../../../service/message/success/success-message.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserProfileResponse } from '../../../../modules/user/user.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('UserProfileUpdateComponent', () => {
  let component: UserProfileUpdateComponent;
  let fixture: ComponentFixture<UserProfileUpdateComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let successMessageService: jasmine.SpyObj<SuccessMessageService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserDetails', 'getUserProfile', 'updateUserProfile']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const successMessageSpy = jasmine.createSpyObj('SuccessMessageService', ['showSuccessMessage']);

    await TestBed.configureTestingModule({
      imports: [UserProfileUpdateComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SuccessMessageService, useValue: successMessageSpy },
        provideAnimations()
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    successMessageService = TestBed.inject(SuccessMessageService) as jasmine.SpyObj<SuccessMessageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.profileForm).toBeDefined();
  });

  it('should load user profile on init', () => {
    
    const mockUser = { userID: '12345' };

    const mockUserDetails = {
      success: true,
      user: {
        userID: '12345',
        _id: '12345',
        name: 'Test User',
        email: 'test@example.com'
      },
      posts: [
        {
          _id: 'post123',
          title: 'Test Post',
          content: 'Some content',
          authorId: '12345',
          likesCount: 10,
          comments: []
        }
      ]
    };

    const mockUserProfile: UserProfileResponse = { success: true, user: { userID: '12345', _id: '12345', name: 'Test User', email: 'test@example.com' }, posts: [] };

    authService.getCurrentUser.and.returnValue(of(mockUser));
    userService.getUserDetails.and.returnValue(of(mockUserDetails));
    userService.getUserProfile.and.returnValue(of(mockUserProfile));

    component.ngOnInit();

    expect(component.profileForm.value.name).toEqual('Test User');
  });

  it('should handle error when loading user profile fails', () => {
    const mockUser = { userID: '12345' };
  
    // Mock the behavior of getCurrentUser and getUserProfile
    authService.getCurrentUser.and.returnValue(of(mockUser));
    
    // Mock an error response for getUserProfile to simulate a failure
    userService.getUserProfile.and.returnValue(throwError(() => new Error('User profile loading failed')));
  
    component.ngOnInit(); // Trigger the initialization
  
    // Expect the errorMessage to be set correctly
    expect(component.errorMessage).toEqual('Failed to authenticate user.');
  });

  it('should update profile successfully', () => {
    const mockUser = { userID: '12345' };
    const mockUpdateResponse: UserProfileResponse = { success: true, user: { userID: '12345', _id: '12345', name: 'Test User', email: 'test@example.com' }, posts: [] };

    authService.getCurrentUser.and.returnValue(of(mockUser));
    userService.updateUserProfile.and.returnValue(of(mockUpdateResponse));

    component.profileForm.setValue({
      name: 'Updated User',
      email: 'updated@example.com',
      username: '',
      phone: '',
      description: '',
      avatar: null
    });

    component.updateProfile();

    expect(successMessageService.showSuccessMessage).toHaveBeenCalled();
  });

  it('should handle update profile failure', () => {
    const mockUser = { userID: '12345' };
    authService.getCurrentUser.and.returnValue(of(mockUser));
    userService.updateUserProfile.and.returnValue(throwError(() => new Error('Update failed')));

    component.updateProfile();

    expect(component.errorMessage).toEqual('Failed to update profile.');
  });

  it('should navigate to profile page on cancel', () => {
    component.cancelUpdate();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
