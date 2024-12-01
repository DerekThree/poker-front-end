import { TestBed } from '@angular/core/testing';

import { BackgroundServiceService } from './background-service.service';

describe('BackgroundServiceService', () => {
  let service: BackgroundServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
