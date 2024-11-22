import { TestBed } from '@angular/core/testing';

import { TogglePostService } from './toggle-post.service';

describe('TogglePostService', () => {
  let service: TogglePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TogglePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
