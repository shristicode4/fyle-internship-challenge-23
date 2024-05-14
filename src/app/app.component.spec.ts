import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle user search correctly', () => {
    const userResponse = {
      login: 'testUser',
      avatar_url: 'https://example.com/avatar',
      html_url: 'https://example.com',
      name: 'Test User',
    };
    spyOn(apiService, 'getUser').and.returnValue(of(userResponse));
    component.searchUser('testUser');
    expect(component.users).toEqual(userResponse);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors during user search', () => {
    spyOn(apiService, 'getUser').and.returnValue(
      throwError(() => new Error('API Error'))
    );
    component.searchUser('testUser');
    expect(component.error).toBe('Error fetching user');
    expect(component.isLoading).toBeFalse();
  });
});

