import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:5000/dashboard';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getGeneralStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/general`, {
      headers: this.getHeaders()
    });
  }

  getTopPrestations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-prestations`, {
      headers: this.getHeaders()
    });
  }
}

