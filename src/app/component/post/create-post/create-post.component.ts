import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { SuccessMessageService } from '../../../service/message/success/success-message.service';
import { TogglePostService } from '../../../service/share-service/toggle-post.service';
import { PostService } from '../../../service/post/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  providers: [SuccessMessageService]
})

export class CreatePostComponent {
  close = faClose;

  isCreatePostVisible: boolean = true;
  submitted: boolean = false;

  createPostForm: FormGroup;
  countdown: number = 3;

  private fb = inject(FormBuilder);
  private successMessageService = inject(SuccessMessageService);
  private togglePostService = inject(TogglePostService);
  private postService = inject(PostService);

  constructor() {
    this.createPostForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required])
    });
  }

  // Submit handler
  onSubmit() {
    this.submitted = true;
  
    if (this.createPostForm.invalid) {
      return;
    }
  
    const post = this.createPostForm.value;
  
    // Proceed with creating the post
    this.postService.createPost(post).subscribe({
      next: (response) => {
        this.successMessageService.showSuccessMessage();
        this.startCountdown();
        
        this.createPostForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error creating post:', error);
      }
    });
  }

  // Countdown for success message
  startCountdown() {
    const intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(intervalId);
        this.togglePostService.toggleCreatePost();
      }
    }, 1000);
  }

  // Close post creation section
  CloseCreatePostSection() {
    this.isCreatePostVisible = false;
    this.togglePostService.toggleCreatePost();
  }

  // Error messages for title
  getTitleErrorMessage() {
    const control = this.createPostForm.get('title');
    if (control?.hasError('required')) {
      return 'Add an unique title to your post';
    }
    return '';
  }

  // Error messages for content
  getContentErrorMessage() {
    const control = this.createPostForm.get('content');
    if (control?.hasError('required')) {
      return 'Describe what do you want to share';
    }
    return '';
  }
}