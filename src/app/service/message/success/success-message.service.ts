import { Injectable, ElementRef } from '@angular/core';
import { initPathLoader, PathLoader } from '../../animation/success/path-loader';

@Injectable({
  providedIn: 'root',
})

export class SuccessMessageService {
  svgPathLoader!: PathLoader;

  constructor(private elementRef: ElementRef) {}

  showSuccessMessage() {
    const svgElement = this.elementRef.nativeElement.querySelector('svg path');
    
    if (svgElement !== null) {
      this.svgPathLoader = initPathLoader(svgElement);
      
      const container = document.querySelector('.hide') as HTMLElement;
      container.style.opacity = '0';
      
      setTimeout(() => {
        container.style.visibility = 'hidden';
        const successMessage = document.querySelector('.success-message') as HTMLElement;
        successMessage.style.visibility = 'visible';
      }, 200);
      
      setTimeout(() => {
        const svg = document.querySelector('svg');

        if (svg) {
          svg.style.opacity = '100';
        }

        const icon = document.querySelector('.icon-checkmark') as HTMLElement;
        icon.style.opacity = '100';
        const circle = document.querySelector('.icon-checkmark circle') as HTMLElement;
        circle.style.transform = 'none';
        const titleElement = document.querySelector('.message_title') as HTMLElement;
        titleElement.style.opacity = '100';
        const contentElement = document.querySelector('.message_content') as HTMLElement;
        contentElement.style.opacity = '100';
        
        this.svgPathLoader.setProgress(1);
      }, 400);
    }
  }

  ShowMultipleSuccessMessages(postId: string) {
    const svgElement = this.elementRef.nativeElement.querySelector(`.post-container[id="${postId}"] svg path`);
    
    if (svgElement !== null) {
      this.svgPathLoader = initPathLoader(svgElement);

      const container = document.querySelector(`.post-container[id="${postId}"] .hide`) as HTMLElement;
      container.style.opacity = '0';

      setTimeout(() => {
        container.style.visibility = 'hidden';
        const successMessage = document.querySelector(`.post-container[id="${postId}"] .success-message`) as HTMLElement;
        successMessage.style.visibility = 'visible';
      }, 200);

      setTimeout(() => {
        const svg = document.querySelector(`.post-container[id="${postId}"] svg`) as SVGElement;

        if (svg) {
          svg.style.opacity = '100';
        }

        const icon = document.querySelector(`.post-container[id="${postId}"] .icon-checkmark`) as HTMLElement;
        icon.style.opacity = '100';
        const circle = document.querySelector(`.post-container[id="${postId}"] .icon-checkmark circle`) as HTMLElement;
        circle.style.transform = 'none';
        const titleElement = document.querySelector(`.post-container[id="${postId}"] .message_title`) as HTMLElement;
        titleElement.style.opacity = '100';
        const contentElement = document.querySelector(`.post-container[id="${postId}"] .message_content`) as HTMLElement;
        contentElement.style.opacity = '100';

        this.svgPathLoader.setProgress(1);
      }, 400);
    }
  }

  hideSuccessMessage() {
    const successMessage = document.querySelector('.success-message') as HTMLElement;
    if (successMessage) {
      successMessage.style.visibility = 'hidden';
    }
  }
}