import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.github.com';

  constructor(private httpClient: HttpClient) {}

  // Method to fetch a GitHub user's profile information
  getUser(username: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/users/${username}`);
  }
  getReposByUrl(url: string): Observable<any> {
    return this.httpClient.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return {
          body: response.body,
          links: this.parseLinkHeader(response.headers.get('link')), // Ensure this is correctly fetching and parsing link headers
        };
      })
    );
  }

  getRepos(
    githubUsername: string,
    page: number = 1,
    perPage: number = 10
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.baseUrl}/users/${githubUsername}/repos?page=${page}&per_page=${perPage}`,
        { observe: 'response' }
      )
      .pipe(
        map((response) => {
          return {
            body: response.body, // the array of repositories
            links: this.parseLinkHeader(response.headers.get('link')), // parse the Link header
          };
        })
      );
  }

  private parseLinkHeader(
    header: string | null
  ): { [key: string]: string } | undefined {
    if (!header || header.length === 0) {
      return;
    }

    let parts = header.split(',');
    let links: { [key: string]: string } = {};
    parts.forEach((p) => {
      let section = p.split(';');
      let url = section[0].replace(/<(.*)>/, '$1').trim();
      let name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });
    return links;
  }

  parsePageFromUrl(url: string): number {
    const match = url.match(/page=(\d+)/);
    return match ? Number(match[1]) : 1; // Return page number or default to 1
  }
}

