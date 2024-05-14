import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

export interface Repository {
  id: number;
  name: string;
  description: string;
  languages: string[]; // Assuming multiple languages
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  username: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  repos: any = [];
  isLoading: boolean = false;
  users: any = null;
  error: string | null = null;

 
  paginationLinks: any = {}; 
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;


  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  searchUser(username: string) {
    this.isLoading = true;
    this.apiService.getUser(username).subscribe({
      next: (userData) => {
        this.users = userData;
        this.isLoading = false;
        // Load repositories 
        this.loadRepos(username, this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.isLoading = false;
      },
    });
  }

  loadRepos(username: string, page: number, pageSize: number) {
    this.isLoading = true;
    // Call the API service 
    this.apiService.getRepos(username, page, pageSize).subscribe({
      next: (repoData) => {
        this.repos = repoData.body;
        this.paginationLinks = repoData.links; //  pagination links
        this.isLoading = false;
        this.updatePageControls(repoData.links);
      },
      error: (error) => {
        console.error('Error fetching repositories:', error);
        this.isLoading = false;
      },
    });
  }

  updatePageControls(links: any) {
    this.hasPreviousPage = !!links.prev;
    this.hasNextPage = !!links.next;
    if (links.next) {
      this.currentPage = this.apiService.parsePageFromUrl(links.next) - 1;
    } else if (links.prev) {
      this.currentPage = this.apiService.parsePageFromUrl(links.prev) + 1;
    }
  }

  loadPage(url: string) {
    this.isLoading = true;
    console.log('Loading URL:', url); // Check the URL being loaded
    this.apiService.getReposByUrl(url).subscribe({
      next: (repoData) => {
        console.log('Repo Data Received:', repoData); // Inspect the received data
        this.repos = repoData.body;
        this.paginationLinks = repoData.links;
        this.isLoading = false;
        this.updatePageControls(repoData.links);
      },
      error: (error) => {
        console.error('Error fetching repositories:', error);
        this.isLoading = false;
      },
    });
  }
}
