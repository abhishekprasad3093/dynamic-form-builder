import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow admin login', () => {
    service.login('admin');
    expect(service.isAdmin()).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should allow user login', () => {
    service.login('user');
    expect(service.isAdmin()).toBeFalse();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should handle logout', () => {
    service.login('admin');
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });
});