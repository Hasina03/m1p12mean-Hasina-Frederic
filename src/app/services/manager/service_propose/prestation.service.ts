import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestationService {

  private apiUrl = 'http://localhost:5000/services-proposes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPrestations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, {
      headers: this.getHeaders()
    });
  }

  getPrestationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createPrestation(prestation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, prestation, {
      headers: this.getHeaders()
    });
  }

  updatePrestation(id: string, prestation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, prestation, {
      headers: this.getHeaders()
    });
  }

  deletePrestation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getPieces(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pieces`, {
      headers: this.getHeaders()
    });
  }
}
