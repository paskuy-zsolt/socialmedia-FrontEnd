import { TestBed } from '@angular/core/testing';

import { CommentEventService } from './comment-event.service';

describe('CommentEventService', () => {
  let service: CommentEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
