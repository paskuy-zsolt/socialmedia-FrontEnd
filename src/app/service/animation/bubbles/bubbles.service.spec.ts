import { TestBed } from '@angular/core/testing';

import { BubblesService } from './bubbles.service';

describe('BubblesService', () => {
  let service: BubblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BubblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
