import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { FeedComponent } from './component/feed/feed.component';
import { LayoutComponent } from './component/layout/layout.component';
import { RecoverPasswordComponent } from './authentication/password/recover-password/recover-password.component';
import { ResetPasswordComponent } from './authentication/password/reset-password/reset-password.component';
import { authGuard, loginGuard } from './guard/auth.guard';
import { ExpiredSessionComponent } from './authentication/expired-session/expired-session.component';
import { UserProfileDetailsComponent } from './component/users/profile-page/user-profile-details/user-profile-details.component';
import { UserListComponent } from './component/users/user-list/user-list.component';
import { PolicyNoticeComponent } from './component/gdpr/policy-notice/policy-notice.component';
import { UserSettingsComponent } from './component/users/profile-page/user-settings/user-settings.component';
import { PostComponent } from './component/post/post.component';
import { DocumentationComponent } from './component/documentation/documentation.component';
import { UserProfileUpdateComponent } from './component/users/profile-page/user-profile-update/user-profile-update.component';
import { TermsOfUseComponent } from './component/gdpr/terms-of-use/terms-of-use.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'expired-session',
    component: ExpiredSessionComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'reset-password',
    component: RecoverPasswordComponent
  },
  { 
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'feed'
      },
      {
        path: 'feed',
        component: FeedComponent
      },
      {
        path: 'post/:id',
        component: PostComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'user/:id',
        component: UserProfileDetailsComponent
      },
      {
        path: 'profile',
        component: UserProfileDetailsComponent
      },
      {
        path: 'profile/update',
        component: UserProfileUpdateComponent
      },
      {
        path: 'profile/settings',
        component: UserSettingsComponent
      },
      {
        path: 'documentation',
        component: DocumentationComponent
      },
      {
        path: 'policy-notice',
        component: PolicyNoticeComponent
      },
      {
        path: 'terms-of-use',
        component: TermsOfUseComponent
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];