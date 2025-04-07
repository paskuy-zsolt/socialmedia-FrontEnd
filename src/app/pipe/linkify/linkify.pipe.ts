import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true
})

export class LinkifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return value;

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let linkedText = value.replace(urlRegex, (match) => {
      return `<a href="${match}" target="_blank" rel="noopener noreferrer" style="color: #0055a9;overflow-wrap: break-word;">${match}</a>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(linkedText);
  }
}