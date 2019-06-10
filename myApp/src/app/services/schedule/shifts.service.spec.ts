import { TestBed } from '@angular/core/testing';

import { ShiftsService } from './shifts.service';

describe('ShiftsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShiftsService = TestBed.get(ShiftsService);
    expect(service).toBeTruthy();
  });
});
