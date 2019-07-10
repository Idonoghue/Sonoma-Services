import { TestBed } from '@angular/core/testing';

import { FileHandlerService } from './file-handler.service';

describe('FileHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileHandlerService = TestBed.get(FileHandlerService);
    expect(service).toBeTruthy();
  });
});
