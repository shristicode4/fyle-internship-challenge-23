import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user data', () => {
    const mockUser = {
      login: 'testUser',
      id: 1,
    };
    service.getUser('testUser').subscribe((user) => {
      expect(user.login).toEqual('testUser');
    });

    const req = httpTestingController.expectOne(
      'https://api.github.com/users/testUser'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockUser);
  });
});



