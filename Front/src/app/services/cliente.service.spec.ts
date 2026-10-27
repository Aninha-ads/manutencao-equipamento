import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()],});
    service = TestBed.inject(ClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
