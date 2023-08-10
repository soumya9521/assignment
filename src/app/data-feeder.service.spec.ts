import { TestBed } from '@angular/core/testing';

import { DataFeederService } from './data-feeder.service';

describe('DataFeederService', () => {
  let service: DataFeederService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFeederService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
