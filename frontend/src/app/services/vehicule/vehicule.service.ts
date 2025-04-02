import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl= `${environment.apiUrl}/vehicules`;
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  addvehicule(vehicule: any): Observable<any> {
    
    return this.http.post(this.apiUrl, vehicule, { headers: this.getHeaders() });
  }

  getvehicule(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  deletevehicule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {headers: this.getHeaders() });
  }


updateDatevehicule(id: string, newDate: string): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return new Observable(observer => {
      observer.error('Token manquant');
    });
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const formattedDate = new Date(newDate).toISOString();

  return this.http.put(`${this.apiUrl}/${id}/dates`, { newDate: formattedDate }, { headers });
}
}
