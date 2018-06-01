import { TestBed, inject } from '@angular/core/testing';

import { CustomBrowserXhrService } from './custom-browser-xhr.service';

describe('CustomBrowserXhrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomBrowserXhrService]
    });
  });

  it('should be created', inject([CustomBrowserXhrService], (service: CustomBrowserXhrService) => {
    expect(service).toBeTruthy();
  }));
});
